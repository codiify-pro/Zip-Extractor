document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const extractButton = document.getElementById("extractButton");
  const fileList = document.getElementById("fileList");

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".zip")) {
      extractButton.disabled = false;
    } else {
      extractButton.disabled = true;
      alert("Please select a valid .zip file.");
    }
  });

  extractButton.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const zip = new JSZip();
    try {
      const contents = await zip.loadAsync(file);
      fileList.innerHTML = "";

      for (const [fileName, fileData] of Object.entries(contents.files)) {
        if (fileData.dir) continue; // Skip directories
        const fileContent = await zip.file(fileName).async("blob");

        // Create a row with file name and download button
        const fileRow = document.createElement("div");
        fileRow.classList.add("file-row");

        // File name display
        const fileNameElement = document.createElement("p");
        fileNameElement.textContent = fileName;

        // Download button
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";

        // Handle download
        downloadButton.addEventListener("click", () => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(fileContent);
          link.download = fileName;
          link.click();
        });

        // Append to file row
        fileRow.appendChild(fileNameElement);
        fileRow.appendChild(downloadButton);

        // Append row to file list
        fileList.appendChild(fileRow);
      }
    } catch (error) {
      alert("Error extracting files: " + error.message);
    }
  });
});
