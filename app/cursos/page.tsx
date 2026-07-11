import CursosClient from "./CursosClient";
import { fetchSiteCourses } from "@/lib/courses-db";

export const revalidate = 300;

export default async function CursosPage() {
  const courses = await fetchSiteCourses();
  return <CursosClient courses={courses} />;
}
