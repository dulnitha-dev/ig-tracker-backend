const redirectUrl = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  });
  const data = await response.json();

  if (data.url) window.location.href = data.url;
  else window.location.reload();
};
