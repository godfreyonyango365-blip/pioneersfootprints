# Press and team content

- `/np-godfrey123/dashboard/press`: add, edit and remove literature distribution updates (title/location, photo and description) and press books (title, KES price, description and cover).
- `/np-godfrey123/dashboard/team`: add, edit and remove team profiles, with name, role, short description and photo upload.
- `/press`: live literature distribution updates, book catalogue and print enquiry form.
- `/team`: existing founding profiles plus saved profiles. A saved profile with the same name replaces the original display.

Content uses the existing Firebase client and `/api/upload` Cloudinary endpoint, as publications do. Distribution updates are stored in `pressDistributions`, books in `pressBooks`, and profiles in `members`. Existing member `metadata` is accepted as a legacy description on the public team page.

Firestore must permit public reads on `pressDistributions`, `pressBooks` and `members`, and restrict writes to your administrators through deployed Firestore rules. The dashboard sign-in check is a navigation guard; Firestore rules enforce write permissions. Do not allow all authenticated users to write. No remote rules or credentials were changed by this implementation.

Photos require the existing Cloudinary server environment variables. Accepted uploads are JPEG, PNG or WebP up to 10 MB. Removing an entry removes its Firestore document; existing Cloudinary images are retained.

WhatsApp enquiries use the existing press number, +254742767609, configured in `lib/press.ts`. The form prepares a message with name, contact, book title, pages, size, colour, copies and notes. The visitor must tap Send in WhatsApp to deliver it. Enquiries are not stored on the website and are not automatically sent by a server.

Before release, test with the configured Firebase project: create a book and profile, verify their public display, edit and remove them, and confirm anonymous writes are denied. Submit a print enquiry on a phone and confirm the recipient and all message fields before sending.
