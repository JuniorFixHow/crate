import { Dispatch, SetStateAction } from "react";
import { SocialProps } from "./ChurchDetails";
import AddButton from "@/components/features/AddButton";

type SocialMediaLinksProps = {
    socialLinks:SocialProps[],
    setSocialLinks:Dispatch<SetStateAction<SocialProps[]>>
}

const SocialMediaLinks = ({socialLinks, setSocialLinks}:SocialMediaLinksProps) => {

  // Add a new social media link
  const handleAddLink = () => {
    const newLink: SocialProps = {
      id: crypto.randomUUID(), // Generate a unique ID
      name: "Account", // Default name
      link: "", // Default link
    };
    setSocialLinks((prev) => [...prev, newLink]);
  };

  // Handle updating a social media entry
  const handleUpdate = (id: string, field: keyof SocialProps, value: string) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  // Remove a link
  const handleRemoveLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((link) => link.id !== id));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-slate-400 font-semibold text-[0.8rem]">
          Social Media
        </span>
        <AddButton onClick={handleAddLink} type="button" text="Add Link" className="rounded-full w-fit" smallText />
      </div>

      {socialLinks.map((link) => (
        <div
          key={link.id}
          className="flex items-center gap-2 border p-2 rounded-md"
        >
          <input
            type="text"
            placeholder="Social Media Account"
            value={link.name}
            required
            onChange={(e) => handleUpdate(link.id, "name", e.target.value)}
            className="border bg-transparent outline-none rounded px-2 py-1 w-1/3"
          />
          <input
            type="url"
            placeholder="Link (e.g., https://example.com)"
            value={link.link}
            required
            onChange={(e) => handleUpdate(link.id, "link", e.target.value)}
            className="border bg-transparent outline-none rounded px-2 py-1 flex-grow"
          />
          <button
            type="button"
            onClick={() => handleRemoveLink(link.id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default SocialMediaLinks;
