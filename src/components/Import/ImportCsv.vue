<script setup>
import { ref } from "vue";
import Papa from "papaparse";

const file = ref(null);
const insertedData = ref([]);

function canSubmit() {
  return file.value != null;
}

const uploadFile = (event) => {
  file.value = event.target.files[0];
};

function unmaskCep(cep) {
  return cep.replace(".", "").replace("-", "");
}

function insertData(importedArray) {
  if (importedArray.length > 0) {
    const values =
      "&cepOri=" +
      unmaskCep(importedArray[0][0]) +
      "&cepDes=" +
      unmaskCep(importedArray[0][1]);
    fetch("http://localhost/datafrete/backend/service.php?action=import" + values)
      .then((response) => response.json())
      .then((data) => {
        insertedData.value.push({
          id: insertedData.value.length,
          cep_ori: importedArray[0][0],
          cep_des: importedArray[0][1],
          result: data && data.success && data.success == 1 ? "Sucesso" : "Falha",
        });
        importedArray.shift();
        insertData(importedArray);
      });
  } else {
    alert("Importação finalizada.");
  }
}

const submitFile = async () => {
  const reader = new FileReader();
  reader.readAsDataURL(file.value);
  reader.onload = async () => {
    try {
      Papa.parse(file.value, {
        download: true,
        encoding: "UTF-8",
        complete: function (results) {
          console.log(results);
          insertData(results.data);
        },
      });
    } catch (error) {
      alert("Erro ao carregar arquivo");
    }
  };
};

function canShowTable() {
  return insertedData.value.length > 0;
}
</script>

<template>
  <div class="mx-auto w-75 row g-3">
    <div class="col-12">
      <label for="imortaCsv">Arquivo</label>
      <input
        id="imortaCsv"
        type="file"
        accept=".csv"
        class="form-control"
        @change="uploadFile($event)"
      />
    </div>

    <div class="col-12">
      <button
        class="btn btn-primary"
        id="submit"
        v-if="canSubmit()"
        @click="submitFile()"
        @submit.prevent="onSubmit"
      >
        Salvar
      </button>
    </div>
    <div class="col-12" v-if="canShowTable()">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Linha</th>
            <th scope="col">Cep Origem</th>
            <th scope="col">Cep Destino</th>
            <th scope="col">Resultado</th>
          </tr>
        </thead>

        <tbody id="listaBody">
          <tr v-for="data in insertedData" :key="data.id">
            <td>{{ data.id }}</td>
            <td>{{ data.cep_ori }}</td>
            <td>{{ data.cep_des }}</td>
            <td>{{ data.result }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
