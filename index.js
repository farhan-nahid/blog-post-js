(function loadSkeleton() {
  const skeletonCSS = `
  <style>
    .skeleton {
      border-radius: 5px;
      animation: 650ms linear infinite alternate skeleton-loading;
    }
    
    .post__tag, .post__author--role {
      height: 20px;
      width: 70px;
    }
    .post__tag:last-of-type {
      width: 110px;
    }
    .post__date, .post__author--name {
      height: 28px;
      width: 140px;
    }
    .post__author--name {
      margin-bottom: 10px;
    }
    .post__header {
      border-radius: 0;
      min-height: 120px;
    }
    .post__author--avatar {
      border-radius: 50%;
      width: 55px;
      height: 55px;
    }
    .post__body .skeleton {
      min-height: 18px;
      margin-bottom: 10px;
    }
    
    .post__body .skeleton:last-of-type {
      width: 80%;
    }
    .btn {
      min-height: 50px;
      min-width: 190px;
    }
    @keyframes skeleton-loading {
      0% {
        background-color: hsl(var(--accent2));
      }
      100% {
        background-color: hsl(var(--accent1) / .2);
      }
    }
  </style>
  `;
  const skeleton = `
        <article class="post">
          <div class="post__meta">
            <div class="post__tag--container">
              <span class="skeleton post__tag"></span>
              <span class="skeleton post__tag"></span>
            </div>
            <p class="skeleton post__date"></p>
          </div>
          <h3 class="skeleton post__header"></h3>
          <div class="post__author">
            <div class="skeleton post__author--avatar" width="55" ></div>
            <div>
              <p class="skeleton post__author--name"></p>
              <p class="skeleton post__author--role"><small></small></p>
            </div>
          </div>
          <div class="post__body">
            <p class="skeleton"></p>
            <p class="skeleton"></p>
            <p class="skeleton"></p>
            <p class="skeleton"></p>
          </div>
          <a href="#" class="skeleton btn"></a>
       </article>
  `;
  document.querySelector(".post-container").innerHTML = [
    skeleton.repeat(3),
    skeletonCSS,
  ].join("");
})();

// query selectors
let posts = [];
let filteredPosts = [];
const POSTS_TO_SHOW = 6;
let maxDisplayLimit = POSTS_TO_SHOW;
const postContainer = document.querySelector(".post-container");
const search = document.querySelector('[type="search"]');

// create cards and update the UI
function generatePost(post) {
  const returnPostDate = (date) =>
    `${
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  const article = document.createElement("article");
  article.classList.add("post");
  article.innerHTML = `
  <div class="post__meta">
    <div class="post__tag--container">
    ${post.meta.tags
      .map((tag) => `<span class="post__tag">${tag}</span>`)
      .join("")}
    </div>
    <p class=" post__date">${returnPostDate(new Date(post.meta.date))}</p>
  </div>
  <h3 class="post__header">
    <a href="${post.meta.url}">${post.title}</a>
  </h3>
  <div class="post__author">
    <img class=" post__author--avatar" width="55" src="${
      post.meta.author.avatar
    }" alt="${post.user.name[0].firstName} ${post.user.name[1].lastName}">
    <div>
      <p class=" post__author--name">${post.user.name[0].firstName} ${
    post.user.name[1].lastName
  }</p>
      <p class=" post__author--role"><small>${
        post.meta.author.jobTitle
      }</small></p>
    </div>
  </div>
  <div class="post__body">
    ${post.summary}
  </div>
  <a href="${post.meta.url}" class="btn">Read Post</a>
  `;
  return article;
}

function loadPosts() {
  const frag = document.createDocumentFragment();
  filteredPosts
    .slice(0, maxDisplayLimit)
    .map((post) => frag.appendChild(generatePost(post)));
  postContainer.innerHTML = "";
  postContainer.appendChild(frag);
}

function filterPosts() {
  const searchFilter = (post) =>
    [
      post.title,
      post.summary,
      post.user.name[0].firstName,
      post.user.name[1].lastName,
      post.meta.tags.map((t) => t).join(""),
    ]
      .join("")
      .toLowerCase()
      .indexOf(search.value.toLowerCase()) !== -1;
  filteredPosts = posts.filter(searchFilter);
  loadPosts();
}

// fetch the data
async function fetchPosts() {
  await fetch("./posts.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      posts = data.sort(
        (a, b) => new Date(b.meta.date) - new Date(a.meta.date)
      );
      filterPosts();
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}
fetchPosts();
// update number of posts with btn click
function viewMorePosts() {
  maxDisplayLimit += POSTS_TO_SHOW;
  loadPosts();
}

document.querySelector(".btn--view").addEventListener("click", viewMorePosts);

// filter for search
search.addEventListener("keyup", filterPosts);
