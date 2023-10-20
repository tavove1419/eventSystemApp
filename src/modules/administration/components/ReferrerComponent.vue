<script setup lang="ts">
  import {ref, onMounted} from 'vue'
  import { QTableProps, useQuasar } from 'quasar'
  import { ReferrerInterface } from '../interfaces';
  import { getAllReferrer, createReferrer, updateReferrer, inactiveReferrer, activeReferrer, inValidCode } from '../composables';


  const $q = useQuasar()
  const filter = ''
  const referrerCreate = ref<boolean>(false)
  const referrerEdit = ref<boolean>(false)
  const referrerDelete = ref<boolean>(false)
  const referrerActive = ref<boolean>(false)
  const referrerName = ref<string>('')
  const referrerList = ref<ReferrerInterface[]>([])
  const referrerForm = ref({
    id: <string | null> null,
    name: <string | null> null,
    last_name: <string | null> null,
    identity: <string | null> null,
    address: <string | null> null,
    phone: <string | null> null,
    email: <string | null> null,
    code_referrer: <string | null> null,
    status: <boolean | null> null,
  })
  const columns: QTableProps['columns'] = [
    {
      name: 'name',
      required: true,
      label: 'Nombres',
      align: 'left',
      sortable: true,
      field: 'name'
    },
    {
      name: 'last_name',
      required: true,
      label: 'Apellidos',
      align: 'left',
      sortable: true,
      field: 'last_name'
    },
    {
      name: 'email',
      required: true,
      label: 'Email',
      align: 'left',
      sortable: true,
      field: 'email'
    },
    {
      name: 'code_referrer',
      required: true,
      label: 'Código',
      align: 'left',
      sortable: true,
      field: 'code_referrer'
    },
    {
      name: 'status',
      required: true,
      label: 'Estado',
      align: 'left',
      sortable: true,
      field: 'status'
    },
    {
      name: 'action',
      align: 'left',
      label: 'Acciones',
      field: ''
    }
  ]

  onMounted(() => {
    gellAllReferrer()
  })

  function gellAllReferrer(): void {
    $q.loading.show({
      message: 'Cargando referenciadores'
    })
    getAllReferrer().then((response) => {
      referrerList.value = response.data
      $q.loading.hide()
    }).catch(() => {
      notify('Error al carga los referenciadores', 'negative')
      $q.loading.hide()
    })
  }

  function addReferrer(): void {
    referrerCreate.value = true
    onReset()
  }

  function onReferrerSave(): void {
    $q.loading.show({
      message: 'Creando referenciador...'
    })
    referrerForm.value.status = true
    createReferrer(referrerForm.value as ReferrerInterface).then((response) => {
      response.data
      notify('Referenciador creado con exito!', 'positive')
      gellAllReferrer()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
    }).finally(() => $q.loading.hide())

  }

  function editReferrer(data: ReferrerInterface) {
    referrerEdit.value = true
    referrerForm.value = {
      id: data.id as string,
      name: data.name,
      last_name: data.last_name,
      identity: data.identity as string,
      address: data.address,
      phone: data.phone as string,
      email: data.email,
      code_referrer: data.code_referrer,
      status: data.status ? true : false
    }
  }

  function onUpdate(): void {
    $q.loading.show({
      message: 'Actualizando referenciador...'
    })
    updateReferrer(referrerForm.value.id as string, referrerForm.value as ReferrerInterface).then((response) => {
      const data = response.data
      notify(`El referenciador ${data.name} ${data.last_name} actualizado con exito!`, 'positive')
      gellAllReferrer()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
    }).finally(() => $q.loading.hide())
  }

  function deleteReferrer(data: ReferrerInterface): void {
    referrerDelete.value = true
    referrerName.value = data.name
    referrerForm.value = {
      id: data.id as string,
      name: data.name,
      last_name: data.last_name,
      identity: data.identity as string,
      address: data.address,
      phone: data.phone as string,
      email: data.email,
      code_referrer: data.code_referrer,
      status: false
    }
  }

  function onDelete(): void {
    $q.loading.show({
      message: 'Inactivando usuario...'
    })
    inactiveReferrer(referrerForm.value.id as string, referrerForm.value as ReferrerInterface).then((response) => {
      const data = response.data
      notify(`El referenciador ${data.name} inactivado con exito!`, 'positive')
      gellAllReferrer()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
    }).finally(() =>  $q.loading.hide())
  }

  function inActiveReferrer(data: ReferrerInterface): void {
    referrerActive.value = true
    referrerName.value = data.name
    referrerForm.value = {
      id: data.id as string,
      name: data.name,
      last_name: data.last_name,
      identity: data.identity as string,
      address: data.address,
      phone: data.phone as string,
      email: data.email,
      code_referrer: data.code_referrer,
      status: true
    }
  }

  function onActive(): void {
    $q.loading.show({
      message: 'Activando evento...'
    })
    activeReferrer(referrerForm.value.id as string, referrerForm.value as ReferrerInterface).then((response) => {
      const data = response.data
      notify(`El referencaidor ${data.name} activado con exito!`, 'positive')
      gellAllReferrer()
    }).catch((err) => {
      notify( err.message ? err.message : 'Revisar que la información este completa', 'negative')
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

  function generateCode() {
    $q.loading.show({
      message: 'Creando codigo...'
    })
    const num = 6
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
      for (let i = 0; i < num; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
    if (referrerForm.value.identity === '' || referrerForm.value.identity === null) return notify( 'Es necesario el numero de identificación', 'negative'), $q.loading.hide()
    inValidCode(referrerForm.value.identity as string, result).then((response) => {
      console.log('object', response)
      referrerForm.value.code_referrer = response.data;
    }).catch((err) => {
      notify( err.message ? err.message : 'Revisar que la información este completa', 'negative')
    }).finally(() => $q.loading.hide())
  }

  function onReset() {
    referrerForm.value = {
      id: null,
      name: null,
      last_name: null,
      identity: null,
      address: null,
      phone: null,
      email: null,
      code_referrer: null,
      status: true
    }
  }

  function isValidEmail(val: string) {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || 'El correo no parece ser válido';
  }

</script>
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      :rows="referrerList"
      :columns="columns"
      row-key="name"
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
            @click="editReferrer(props.row)"
          ></q-btn>
          <q-btn
            :disable="!props.row.status"
            dense
            flat
            round
            icon="delete"
            color="red"
            @click="deleteReferrer(props.row)"
          ></q-btn>
          <q-btn
            :disable="props.row.status"
            dense
            flat
            round
            icon="check_box"
            color="green"
            @click="inActiveReferrer(props.row)"
          ></q-btn>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td top-center>
          <q-checkbox
            v-model="props.row.status"
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
          label="Agregar Referenciador"
          @click="addReferrer()"
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

  <div class="q-gutter-sm">
    <q-dialog v-model="referrerCreate" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h5 text-center q-mt-sm text-bold">Crear Referenciador</div>
          <hr />
        </q-card-section>
        <q-card-section>
          <q-form ref="form" class="row q-col-gutter-md">
            <div class="col-12 col-sm-12">
              <q-input
                v-model="referrerForm.name"
                rounded
                outlined
                label="Nombres"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar nombres']"
              />
              <q-input
                v-model="referrerForm.last_name"
                rounded
                outlined
                label="Apellidos"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar apellidos']"
              />
              <q-input
                v-model="referrerForm.identity"
                rounded
                outlined
                label="Identificación"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar identificación']"
              />
              <q-input
                v-model="referrerForm.address"
                rounded
                outlined
                label="Dirección"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar dirección']"
              />
              <q-input
                v-model="referrerForm.phone"
                rounded
                outlined
                label="Teléfono"
                mask="(###) ### - ####"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el numero telefonico']"
              />
              <q-input
                v-model="referrerForm.email"
                rounded
                outlined
                label="Email"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el email', isValidEmail]"
              />
              <q-input
                v-model="referrerForm.code_referrer"
                rounded
                outlined
                label="Codigo Referencia"
                :type="'text'"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor generar Código']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="'autorenew'"
                    class="cursor-pointer"
                    @click="generateCode()"
                  />
                </template>
              </q-input>
              <q-checkbox
                v-model="referrerForm.status"
                label="Activo"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                color="green"
                disable
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
                @click="onReferrerSave()"
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
    <q-dialog v-model="referrerEdit" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h5 text-center q-mt-sm text-bold">
            Editar Referenciador
          </div>
          <hr />
        </q-card-section>
        <q-card-section>
          <q-form ref="form" class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="referrerForm.name"
                rounded
                outlined
                label="Nombres"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar nombres']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="referrerForm.last_name"
                rounded
                outlined
                label="Apellidos"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar apellidos']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="referrerForm.identity"
                rounded
                outlined
                label="Identificación"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar la identificación']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="referrerForm.address"
                rounded
                outlined
                label="Dirección"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar dirección']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="referrerForm.phone"
                rounded
                outlined
                label="Teléfono"
                mask="(###) ### - ####"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el numero telefonico']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="referrerForm.email"
                rounded
                outlined
                label="Email"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el email', isValidEmail]"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="referrerForm.code_referrer"
                rounded
                disable
                outlined
                label="Codigo Referencia"
                :type="'text'"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor generar Código']"
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

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="referrerDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete_forever" color="negative" text-color="white" />
          <span class="q-ml-sm">Desea inactivar el referenciador: <strong> {{ referrerName }} </strong> ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Eliminar" @click="onDelete()" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="referrerActive" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="check_circle" color="positive" text-color="white" />
          <span class="q-ml-sm">Desea activar el referenciadpr: <strong> {{ referrerName }} </strong> ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Activar" @click="onActive()" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style scoped lang="scss">

</style>
