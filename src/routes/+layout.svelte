<script>
  import '../app.css'
  let { children } = $props()
</script>

<nav>
  <a href="/">Home</a>
</nav>

<style>
    nav {
        display: flex;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
    }

    a {
        color: #ffffff;
        text-decoration: none;
        font-weight: bold;
        transition: all 0.3s;
    }

    a:hover {
        text-decoration: underline;
        filter: brightness(70%);
    }
</style>

{@render children()}
