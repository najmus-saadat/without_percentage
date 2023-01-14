const btn = document.getElementById("dn_btn");
const loaded_pointer = document.getElementById("loaded_percentage");
const loader_wrapper = document.getElementsByClassName("loader_wrapper")[0];
const lds_spinner = document.getElementsByClassName("lds-spinner")[0];

btn.addEventListener("click", function () {
  btn.classList.add("hide");
  loader_wrapper.classList.add("show");
  downloadfile();
});

function downloadfile() {
  let URL_to_file = "books.pdf";
  let file_name_with_extension = "books.pdf";

  fetch(URL_to_file)
    .then((res) => {
      if (res.status != 200) {
        return Promise.reject();
      }

      const contentLength = res.headers.get("content-length");

      return new Response(
        new ReadableStream({
          start(controller) {
            const reader = res.body.getReader();
            function read() {
              reader.read().then((progressEvenet) => {
                if (progressEvenet.done == true) {
                  controller.close();
                  return;
                }

                controller.enqueue(progressEvenet.value);
                read();
              });
            }
            read();
          },
        })
      );
    })
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file_name_with_extension;
      anchor.click();
      lds_spinner.classList.add("hide");
      loaded_pointer.innerText = "Your download will begin shortly";
      anchor.remove();
    })
    .catch(() => {
      lds_spinner.classList.add("hide");
      loaded_pointer.innerText = "Download link may be broken";
    });
}
