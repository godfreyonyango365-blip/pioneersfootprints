import ContentManager from "@/components/admin/ContentManager";
export default function Page() {
  return (
    <div className="space-y-16">
      <ContentManager kind="distributions" />
      <div className="border-t border-slate-300 pt-16">
        <ContentManager kind="books" />
      </div>
    </div>
  );
}
