export async function parseResumeFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://127.0.0.1:8081/parse-resume", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to parse resume");
  }

  const data = await response.json();

  return data.blocks.map((block, index) => ({
    id: String(index),
    text: block.text,
    type: block.type,
  }));
}
