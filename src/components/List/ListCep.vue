<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

const listData = ref([]);

onMounted(() => {
  loadList();
})

function loadList() {
  fetch("http://localhost/datafrete/backend/service.php?action=list")
    .then((response) => response.json())
    .then((data) => {
      listData.value = data.value;
    });
}

function edit(id, lat, lon) {
  router.push({ path: '/edit/'+id+'/'+lat+'/'+lon });
}

function remove(id) {
  fetch("http://localhost/datafrete/backend/service.php?action=delete&id="+id)
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.success == 1) {
        alert("Registro excluído com sucesso!");
        loadList();
      } else {
        alert ("Falha ao excluir o registro")
      }
    });
}
</script>

<template>
  <div id="telaLista" class="mx-auto w-75">
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Cep Origem</th>
          <th scope="col">Cep Destino</th>
          <th scope="col">Distancia Calculada (m)</th>
          <th scope="col">Data Cadastro</th>
          <th scope="col">Data Altera&ccedil;&atilde;o</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>

      <tbody id="listaBody">
        <tr v-for="data in listData" :key="data.id">
          <td>{{ data.id }}</td>
          <td>{{ data.cep_ori }}</td>
          <td>{{ data.cep_des }}</td>
          <td>{{ data.dist_calculada }}</td>
          <td>{{ data.dt_cadastro }}</td>
          <td>{{ data.dt_alteracao }}</td>
          <td>
            <button class="btn btn-primary" @click="edit(data.id, data.cep_ori, data.cep_des)">Editar</button>
          </td>
          <td>
            <button class="btn btn-primary" @click="remove(data.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
