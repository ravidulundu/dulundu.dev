import ProjectForm from "@/components/admin/ProjectForm";

export default function NewPortfolioProjectPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Add a new project to your portfolio</p>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}
