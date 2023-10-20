<script setup lang="ts">
  import {ref, onMounted} from 'vue'
  import { QTableProps, useQuasar } from 'quasar'
  import { WinnerInterface, EventInterface, EventListInterface } from '../interfaces';
  import { getAllWinner, createWinner, updateWinner, searchWinnerNumber, getAllEvent } from '../composables';


  const $q = useQuasar()
  const filter = ''
  const winnerCreate = ref<boolean>(false)
  const winnerEdit = ref<boolean>(false)
  const winnerList = ref<WinnerInterface[]>([])
  const winnerResponse = ref<WinnerInterface>()
  const model = ref()
  const eventList = ref<EventInterface[]>([])
  const optionEvent = ref<EventListInterface[]>([])
  const winnerForm = ref({
    id: <string | null> null,
    number_winner: <string | null> null,
    name_winner: <string | null> null,
    identity_winner: <string | null> null,
    city: <string | null> null,
    event_id: <string | null> null,
    event_name: <string | null> null,
    date_winner: <Date | null>null
  })
  const columns: QTableProps['columns'] = [
    {
      name: 'number_winner',
      required: true,
      label: 'Número ganador',
      align: 'left',
      sortable: true,
      field: 'number_winner'
    },
    {
      name: 'name_winner',
      required: true,
      label: 'Nombre ganador',
      align: 'left',
      sortable: true,
      field: 'name_winner'
    },
    {
      name: 'identity_winner',
      required: true,
      label: 'Identidad',
      align: 'left',
      sortable: true,
      field: 'identity_winner'
    },
    {
      name: 'event_name',
      required: true,
      label: 'Nombre evento',
      align: 'left',
      sortable: true,
      field: 'event_name'
    },
    {
      name: 'date_winner',
      required: true,
      label: 'Fecha ganador',
      align: 'left',
      sortable: true,
      field: 'date_winner'
    },
    {
      name: 'city',
      required: true,
      label: 'Ciudad',
      align: 'left',
      sortable: true,
      field: 'city'
    },
    {
      name: 'action',
      align: 'left',
      label: 'Acciones',
      field: ''
    }
  ]

  onMounted(() => {
    getEvents()
    gellAllWinner()
  })

  function gellAllWinner(): void {
    $q.loading.show({
      message: 'Cargando plan'
    })
    getAllWinner().then((response) => {
      winnerList.value = response.data
    }).catch(() => {
      notify('Error al carga los ganadores', 'negative')
    }).finally(() => $q.loading.hide())
  }

  function getEvents(): void {
    $q.loading.show({
      message: 'Cargando eventos'
    })
    getAllEvent().then((response) => {
      eventList.value = response.data
      for (const data of eventList.value) {
        optionEvent.value.push({
          id: data.id,
          name: data.name,
          description: data.description,
          status: data.status,
          label: data.name,
          value: data.id as string
        })
      }
    }).catch(() => {
      notify('Error al carga los eventos', 'negative')
    }).finally(() => $q.loading.hide())
  }

  function addWinner(): void {
    winnerCreate.value = true
    onReset()
  }

  function searchNumber(): void {
    $q.loading.show({
      message: 'Cargando eventos'
    })
    const number = winnerForm.value.number_winner
    const idEvent = winnerForm.value.event_id
    searchWinnerNumber(number?.toString() as string, idEvent as string)
    .then((response) => {
      winnerResponse.value = response.data
      winnerForm.value.name_winner = winnerResponse.value?.name_winner as string
      winnerForm.value.number_winner = winnerResponse.value?.number_winner as string
      winnerForm.value.identity_winner = winnerResponse.value?.identity_winner as string
      winnerForm.value.event_name = winnerResponse.value?.event_name as string
      winnerForm.value.event_id = winnerResponse.value?.event_id as string
      winnerForm.value.city = winnerResponse.value?.city as string
    })
    .catch((err) => notify(err?.message ? err?.message : 'Revisar que la información este completa', 'negative'))
    .finally(() => $q.loading.hide())
  }

  function onWinnerSave(): void {
    $q.loading.show({
      message: 'Registrando ganador evento...'
    })
    if (winnerForm.value.date_winner === null) notify('DSebe seleccionar la fecha del numero ganador', 'warning')
    createWinner(winnerForm.value as WinnerInterface).then((response) => {
      response.data
      notify('Registro realizado con exito!', 'positive')
      gellAllWinner()
    }).catch((err) => {
      notify(err?.message ? err?.message : 'Revisar que la información este completa', 'negative')
    }).finally(() => $q.loading.hide())

  }

  function editWinner(data: WinnerInterface) {
    winnerEdit.value = true
    winnerForm.value = {
      id: data.id as string,
      number_winner: data.number_winner,
      name_winner: data.name_winner,
      identity_winner: data.identity_winner,
      city: data.city,
      event_id: data.event_id,
      event_name: data.event_name,
      date_winner: data.date_winner
    }
  }

  function onUpdate(): void {
    $q.loading.show({
      message: 'Actualizando evento...'
    })
    updateWinner(winnerForm.value.id as string, winnerForm.value as WinnerInterface).then(() => {
      notify('El ganador se ha actualizado con exito!', 'positive')
      gellAllWinner()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
    }).finally(() => $q.loading.hide())
  }

  function notify(msg: string, type: string) {
    $q.notify({
      message: msg,
      type: type,
      position: 'top',
      timeout: 5000
    })
  }

  function onReset() {
    winnerForm.value = {
      id: null,
      number_winner: null,
      name_winner: null,
      identity_winner: null,
      city: null,
      event_id: null,
      event_name: null,
      date_winner: null
    }
  }
</script>
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      :rows="winnerList"
      :columns="columns"
      row-key="number_winner"
      :filter="filter"
    >
      <template #body-cell-action="props">
        <q-td top-center>
          <q-btn
            dense
            flat
            round
            color="blue"
            field="edit"
            icon="edit"
            @click="editWinner(props.row)"
          ></q-btn>
        </q-td>
      </template>

      <template #body-cell-active="props">
        <q-td top-center>
          <q-checkbox
            v-model="props.row.active"
            center-label
            checked-icon="task_alt"
            unchecked-icon="highlight_off"
            color="green"
            disable
          />
        </q-td>
      </template>

      <template v-slot:top>
        <q-btn
          color="primary"
          label="Registrar Ganador"
          @click="addWinner()"
        ></q-btn>
        <q-space></q-space>
        <q-input dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
      </template>
    </q-table>
  </div>

  <div class="q-gutter-lg">
    <q-dialog v-model="winnerCreate" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h5 text-center q-mt-sm text-bold">Registro Ganador</div>
          <hr />
        </q-card-section>
        <q-card-section>
          <q-form ref="form" class="row q-col-gutter-md">
            <div class="col-3">
              <q-input
                v-model="winnerForm.number_winner"
                mask="####"
                outlined
                label="Numero Ganador"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar numero']"
              />
            </div>
            <div class="col-6">
              <q-select
                outlined
                v-model="model"
                emit-value
                map-options
                :options="optionEvent"
                clearable
                label="Seleccionar Evento"
                @update:model-value="(val: string) => winnerForm.event_id = val"
              />
            </div>
            <div class="col-3">
              <q-btn
                label="Buscar"
                outline
                color="positive"
                @click="searchNumber()"
              >
              </q-btn>
            </div>
            <div class="col-6">
              <q-input
                v-model="winnerForm.name_winner"
                reverse-fill-mask
                outlined
                disable
                label="Nombre Ganador"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar nombres']"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="winnerForm.identity_winner"
                mask="#"
                disable
                reverse-fill-mask
                outlined
                label="Número de Identificación"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar la identificación']"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="winnerForm.city"
                reverse-fill-mask
                outlined
                disable
                label="Ciudad"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar la ciudad']"
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="winnerForm.event_name"
                reverse-fill-mask
                outlined
                disable
                label="Evento"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el nombre del evento']"
              />
            </div>
            <div class="col-12 text-center">
              <q-date
                v-model="winnerForm.date_winner"
                minimal
              />
            </div>
            <div class="col-12 text-right q-gutter-sm">
              <q-btn
                label="Cancelar"
                outline
                rounded
                color="deep-orange"
                v-close-popup
              >
              </q-btn>
              <q-btn
                label="Guardar"
                outline
                rounded
                color="primary"
                @click="onWinnerSave()"
                v-close-popup
              >
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="winnerEdit" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h5 text-center q-mt-sm text-bold">
            Editar Ganador
          </div>
          <hr />
        </q-card-section>
        <q-card-section>
          <q-form ref="form" class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="winnerForm.number_winner"
                rounded
                mask="#"
                outlined
                label="Numero Ganador"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar numero']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="winnerForm.name_winner"
                rounded
                reverse-fill-mask
                outlined
                label="Nombre Ganador"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar nombres']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="winnerForm.identity_winner"
                rounded
                mask="#"
                reverse-fill-mask
                outlined
                label="Número de Identificación"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar la identificación']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="winnerForm.identity_winner"
                rounded
                mask="#"
                reverse-fill-mask
                outlined
                label="Número de Identificación"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar la identificación']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="winnerForm.city"
                rounded
                reverse-fill-mask
                outlined
                label="Ciudad"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar la ciudad']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="winnerForm.event_name"
                rounded
                reverse-fill-mask
                outlined
                label="Evento"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el nombre del evento']"
              />
            </div>
            <div class="col-12">
              <q-date
                v-model="winnerForm.date_winner"
                minimal
              />
            </div>
            <div class="col-12 text-right q-gutter-sm">
              <q-btn
                label="Cancelar"
                outline
                rounded
                color="deep-orange"
                v-close-popup
              >
              </q-btn>
              <q-btn
                label="Actualizar"
                outline
                rounded
                color="primary"
                @click="onUpdate()"
                v-close-popup
              >
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style scoped lang="scss">
 .my-card {
    max-width: 750px;
 }
</style>
