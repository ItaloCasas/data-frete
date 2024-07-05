<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const id = ref("");
const cepOrigem = ref("");
const latOrigem = ref("");
const lonOrigem = ref("");

const cepDestino = ref("");
const latDestino = ref("");
const lonDestino = ref("");

const distCalculada = ref("");

onMounted(() => {
  const params = router ? router.currentRoute.value.params : false;
  if (params && params.id && params.origem && params.destino) {
    id.value = params.id;
    cepOrigem.value = params.origem;
    cepDestino.value = params.destino;

    validateCEP(cepOrigem.value);
    validateCEP(cepDestino.value);
  }
});

function canSubmit() {
  return (
    latOrigem.value &&
    latDestino.value &&
    lonOrigem.value &&
    lonDestino.value &&
    distCalculada.value
  );
}

function fillLatLon(cep, lat, lon) {
  if (cep == unmaskCep(cepOrigem.value)) {
    latOrigem.value = lat;
    lonOrigem.value = lon;
  }
  if (cep == unmaskCep(cepDestino.value)) {
    latDestino.value = lat;
    lonDestino.value = lon;
  }
}

function unmaskCep(cep) {
  return cep.replace(".", "").replace("-", "");
}

function unmaskDistancia() {
  return distCalculada.value.replace(".", "").replace(",", ".");
}

function validateCEP(cep) {
  let unmaskedCep = unmaskCep(cep);
  if (unmaskedCep.length != 8) {
    cepOrigem.value = "";
    return alert("CEP inválido!");
  }
  fetch(
    "http://localhost/datafrete/backend/service.php?action=validateCEP&value=" +
      unmaskedCep
  )
    .then((response) => response.json())
    .then((data) => {
      if (data && data.success && data.success == 1) {
        let objRet = JSON.parse(data.value);
        if (
          !objRet.location.coordinates.latitude ||
          !objRet.location.coordinates.longitude
        ) {
          return alert("CEP incorreto.");
        }

        fillLatLon(
          unmaskCep(cep),
          objRet.location.coordinates.latitude,
          objRet.location.coordinates.longitude
        );
        calculateDistance();
      } else {
        alert("Ocorreu um erro ao consultar o CEP.");
      }
    });
  return;
}

function calculateDistance() {
  if (latOrigem.value && latDestino.value && lonOrigem.value && lonDestino.value) {
    let values = "&lat1=" + latOrigem.value;
    values += "&lat2=" + latDestino.value;
    values += "&lon1=" + lonOrigem.value;
    values += "&lon2=" + lonDestino.value;

    fetch(
      "http://localhost/datafrete/backend/service.php?action=calculateDistance" + values
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success && data.success == 1) {
          distCalculada.value = data.value;
        } else {
          alert("Ocorreu um erro ao calcular a distância.");
        }
      });
  }
}

function submit() {
  if (id.value) {
    edit();
  } else {
    add();
  }
}

function add() {
  if (cepOrigem.value && cepDestino.value && distCalculada.value) {
    let values =
      "&cepOri=" +
      unmaskCep(cepOrigem.value) +
      "&cepDes=" +
      unmaskCep(cepDestino.value) +
      "&distCalc=" +
      unmaskDistancia(distCalculada.value);

    fetch("http://localhost/datafrete/backend/service.php?action=persist" + values)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success && data.success == 1) {
          alert('Registro salvo.');
          router.push({ path: '/list' });
        } else {
          alert("Ocorreu um erro ao registrar os dados.");
        }
      });
  }
}

function edit() {
  if (id.value && cepOrigem.value && cepDestino.value && distCalculada.value) {
    let values =
      "&id=" +
      id.value +
      "&cepOri=" +
      unmaskCep(cepOrigem.value) +
      "&cepDes=" +
      unmaskCep(cepDestino.value) +
      "&distCalc=" +
      unmaskDistancia(distCalculada.value);

    fetch("http://localhost/datafrete/backend/service.php?action=update" + values)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data && data.success && data.success == 1) {
          alert('Registro salvo.');
          router.push({ path: '/list' });
        } else {
          alert("Ocorreu um erro ao registrar os dados.");
        }
      });
  }
}
</script>

<template>
  <div id="telaCadastro">
    <div class="mx-auto w-75 row g-3">
        <div class="col-md-4">
          <label for="cepOrigem" class="form-label">CEP Origem</label>
          <input
            type="text"
            id="cepOrigem"
            class="form-control"
            placeholder="Digite o CEP de origem"
            v-model="cepOrigem"
            @change="validateCEP(cepOrigem)"
            v-maska="'##.###-###'"
          />
        </div>
        <div class="col-md-4">
          <label for="latOrigem" class="form-label">Latitude Origem</label>
          <input
            type="text"
            class="form-control"
            id="latOrigem"
            placeholder="Latitude Origem"
            v-model="latOrigem"
            disabled
          />
        </div>
        <div class="col-md-4">
          <label for="lonOrigem" class="form-label">Longitude Origem</label>
          <input
            type="text"
            class="form-control"
            id="lonOrigem"
            v-model="lonOrigem"
            placeholder="Longitude Origem"
            disabled
          />
        </div>

        <div class="col-md-4">
          <label for="cepDestino" class="form-label">CEP Destino</label>
          <input
            type="text"
            id="cepDestino"
            class="form-control"
            placeholder="Digite o CEP de Destino"
            v-model="cepDestino"
            @change="validateCEP(cepDestino)"
            v-maska="'##.###-###'"
          />
        </div>
        <div class="col-md-4">
          <label for="latDestino" class="form-label">Latitude Destino</label>
          <input
            type="text"
            class="form-control"
            id="latDestino"
            placeholder="Latitude Destino"
            v-model="latDestino"
            disabled
          />
        </div>
        <div class="col-md-4">
          <label for="lonDestino" class="form-label">Longitude Destino</label>
          <input
            type="text"
            class="form-control"
            id="lonDestino"
            v-model="lonDestino"
            placeholder="Longitude Destino"
            disabled
          />
        </div>

        <div class="col-12">
          <label for="inputAddress" class="form-label"
            >Dist&acirc;ncia Calculada (m)</label
          >
          <input
            type="text"
            class="form-control"
            id="distancia"
            placeholder="Dist&acirc;ncia Calculada"
            v-model="distCalculada"
            disabled
          />
        </div>

        <div class="col-12">
          <button
            class="btn btn-primary"
            id="submit"
            v-if="canSubmit()"
            @click="submit()"
            @submit.prevent="onSubmit"
          >
            Salvar
          </button>
        </div>
    </div>
  </div>
</template>
