import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';
import { Event, type EventDocument } from './event.model';

export interface BookingAttributes {
  eventId: Types.ObjectId;
  email: string;
}

export interface BookingDocument extends BookingAttributes, Document {
  createdAt: Date;
  updatedAt: Date;
}

export type BookingModel = Model<BookingDocument>;

const BookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

/**
 * Pre-save hook:
 * - Validates email format.
 * - Ensures the referenced Event exists before creating a booking.
 *
 * Throwing inside this hook will abort the save operation.
 */
BookingSchema.pre<BookingDocument>('save', async function preSave() {
  const normalizedEmail = this.email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    throw new Error('Booking email must be a valid email address.');
  }

  this.email = normalizedEmail;

  // Verify that the referenced event exists to avoid orphaned bookings.
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error('Cannot create booking: referenced event does not exist.');
  }
});

// Index on eventId for efficient lookups by event.
BookingSchema.index({ eventId: 1 });

export const Booking: BookingModel =
  (models.Booking as BookingModel) || model<BookingDocument, BookingModel>('Booking', BookingSchema);
