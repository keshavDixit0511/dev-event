import { Schema, model, models, type Document, type Model } from 'mongoose';

/**
 * Public shape of an Event document.
 */
export interface EventAttributes {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // 24h time string (HH:MM)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

export interface EventDocument extends EventAttributes, Document {
  createdAt: Date;
  updatedAt: Date;
}

export type EventModel = Model<EventDocument>;

/**
 * Simple, dependency-free slug generator.
 * Converts a title into a URL-safe, lowercase slug.
 */
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const EventSchema = new Schema<EventDocument, EventModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true, default: [] },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true, default: [] },
  },
  {
    timestamps: true,
    strict: true,
  },
);

/**
 * Pre-save hook:
 * - Ensures required string and array fields are non-empty.
 * - Normalizes `date` to ISO YYYY-MM-DD.
 * - Validates `time` as 24-hour HH:MM.
 * - Generates / updates slug when the title changes.
 *
 * Errors thrown here will prevent the document from being saved.
 */
EventSchema.pre<EventDocument>('save', function preSave() {
  // Validate non-empty required strings.
  if (!this.title.trim()) {
    throw new Error('Event title is required.');
  }
  if (!this.description.trim()) {
    throw new Error('Event description is required.');
  }
  if (!this.overview.trim()) {
    throw new Error('Event overview is required.');
  }
  if (!this.image.trim()) {
    throw new Error('Event image is required.');
  }
  if (!this.venue.trim()) {
    throw new Error('Event venue is required.');
  }
  if (!this.location.trim()) {
    throw new Error('Event location is required.');
  }
  if (!this.mode.trim()) {
    throw new Error('Event mode is required.');
  }
  if (!this.audience.trim()) {
    throw new Error('Event audience is required.');
  }
  if (!this.organizer.trim()) {
    throw new Error('Event organizer is required.');
  }

  // Validate non-empty string arrays.
  if (!Array.isArray(this.agenda) || this.agenda.length === 0) {
    throw new Error('Event agenda must be a non-empty array.');
  }
  if (this.agenda.some((item) => !item || !item.trim())) {
    throw new Error('Event agenda items must be non-empty strings.');
  }

  if (!Array.isArray(this.tags) || this.tags.length === 0) {
    throw new Error('Event tags must be a non-empty array.');
  }
  if (this.tags.some((item) => !item || !item.trim())) {
    throw new Error('Event tags must be non-empty strings.');
  }

  // Normalize and validate date as ISO (YYYY-MM-DD).
  const parsedDate = new Date(this.date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('Event date must be a valid date.');
  }
  const isoDate = parsedDate.toISOString().split('T')[0];
  this.date = isoDate;

  // Validate time as 24-hour HH:MM.
  const normalizedTime = this.time.trim();
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/; // 00:00 - 23:59
  if (!timePattern.test(normalizedTime)) {
    throw new Error('Event time must be in HH:MM 24-hour format.');
  }
  this.time = normalizedTime;

  // Generate or update slug only when title changes or is new.
  if (this.isNew || this.isModified('title')) {
    this.slug = slugify(this.title);
  }
});

// Unique index on slug for fast lookups and integrity guarantees.
EventSchema.index({ slug: 1 }, { unique: true });

export const Event: EventModel = (models.Event as EventModel) || model<EventDocument, EventModel>('Event', EventSchema);
