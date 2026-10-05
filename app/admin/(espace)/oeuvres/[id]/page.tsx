import { notFound } from "next/navigation";
import WorkEditor from "@/components/admin/WorkEditor";
import { getWorkById } from "@/lib/works";

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const work = await getWorkById(Number((await params).id));
  if (!work) notFound();
  return (
    <>
      <div className="admin-title">
        <div>
          <h1>Modifier le récit</h1>
          <p>{work.title}</p>
        </div>
      </div>
      <WorkEditor work={work} />
    </>
  );
}
