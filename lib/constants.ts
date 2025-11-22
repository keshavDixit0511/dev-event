export type EventItem = {
    image : string;
    title : string;
    slug : string;
    location : string;
    date : string;
    time : string;
}

export const events : EventItem[] = [
  {
    title: "React Summit 2025",
    image: "/images/event1.png",
    slug: "react-summit-2025",
    location: "Amsterdam, Netherlands",
    date: "2025-06-12",
    time: "09:00",
  },
  {
    title: "JSConf EU",
    image: "/images/event2.png",
    slug: "jsconf-eu-2025",
    location: "Berlin, Germany",
    date: "2025-09-18",
    time: "10:00",
  },
  {
    title: "HackMIT",
    image: "/images/event3.png",
    slug: "hackmit-2025",
    location: "Cambridge, MA, USA",
    date: "2025-10-04",
    time: "08:00",
  },
  {
    title: "Google I/O",
    image: "/images/event4.png",
    slug: "google-io-2025",
    location: "Mountain View, CA, USA",
    date: "2025-05-14",
    time: "10:00",
  },
  {
    title: "PyCon US",
    image: "/images/event5.png",
    slug: "pycon-us-2025",
    location: "Salt Lake City, UT, USA",
    date: "2025-04-23",
    time: "09:00",
  },
  {
    title: "DevFest",
    image: "/images/event6.png",
    slug: "devfest-2025",
    location: "London, UK",
    date: "2025-11-10",
    time: "09:30",
  },
];