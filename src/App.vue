<script>
export default {
  name: "App",
};
</script>

<template>
  <ul class="nav nav-tabs mx-auto w-75">
    <li
      ref="tabCadastro"
      class="nav-item nav-link"
      :class="{ active: $route.path === '/add' || $route.path === '/' }"
    >
      <RouterLink to="/add">Cadastro</RouterLink>
    </li>

    <li
      ref="tabImporta"
      class="nav-item nav-link"
      :class="{ active: $route.path === '/import' }"
    >
      <RouterLink to="/import">Importar CSV</RouterLink>
    </li>

    <li
      ref="tabLista"
      class="nav-item nav-link"
      :class="{ active: $route.path === '/list' }"
    >
      <RouterLink to="/list">Lista</RouterLink>
    </li>
  </ul>
  <main>
    <RouterView />
  </main>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
