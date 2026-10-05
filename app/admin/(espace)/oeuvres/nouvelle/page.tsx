import WorkEditor from "@/components/admin/WorkEditor";

export default function NewWorkPage() {
  return (
    <>
      <div className="admin-title">
        <div>
          <h1>Un nouveau récit</h1>
          <p>Collez votre texte : la couverture naîtra de ce qu'il raconte.</p>
        </div>
      </div>
      <WorkEditor />
    </>
  );
}
