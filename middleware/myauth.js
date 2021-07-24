export default function(x) {
  const { store, redirect, req } = x

  let user = null
  try {
    user = JSON.parse(cookie.get('xxx', req ?? req.headers.cookie))
  } catch (error) {}

  if (!user && !store.state.user) {
    return redirect('/')
  }

  // If the user is not authenticated
}
