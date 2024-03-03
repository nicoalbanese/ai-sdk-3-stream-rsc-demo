import { Card } from "../ui/card";

export function AlbumSuggestion({ id }: { id: string }) {
  return (
    <Card className="bg-black rounded-full">
      <iframe
        style={{ borderRadius: "12px" }}
        src={`https://open.spotify.com/embed/album/${id}?utm_source=generator&theme=0`}
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </Card>
  );
}
