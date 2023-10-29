<script setup lang="ts">
  import {ref, onMounted} from 'vue'
  import { QTableProps, useQuasar } from 'quasar'
  import { UserInterface } from '../interfaces';
  import { getAllUser, createUser, updateUser, activeUser, inactiveUser } from '../composables';
  import Crypto from 'src/share/crypto-library/crypto'

  const crypto = new Crypto()
  const $q = useQuasar()
  const filter = ''
  const isPwd = ref(true)
  const userCreate = ref<boolean>(false)
  const userEdit = ref<boolean>(false)
  const userDelete = ref<boolean>(false)
  const userActive = ref<boolean>(false)
  const userName = ref<string>('')
  const userList = ref<UserInterface[]>([])
  const userForm = ref({
    id: <string | null> null,
    name: <string | null> null,
    last_name: <string | null> null,
    password: <string | null> null,
    phone: <string | null> null,
    address: <string | null> null,
    email: <string | null> null,
    rol: <string | null> null,
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
      name: 'rol',
      required: true,
      label: 'Rol',
      align: 'left',
      sortable: true,
      field: 'rol'
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
  const roles = [
  'Administrador',
  'Auxiliar',
  ];

  onMounted(() => {
    gellAllUser()
  })

  function gellAllUser(): void {
    $q.loading.show({
      message: 'Cargando usuarios'
    })
    getAllUser().then((response) => {
      userList.value = response.data
      userList.value = userList.value.filter((data) => data.rol !== 'Referenciador')
      $q.loading.hide()
    }).catch(() => {
      notify('Error al carga los usuarios', 'negative')
      $q.loading.hide()
    })
  }

  function addUser(): void {
    userCreate.value = true
    onReset()
  }

  function onUserSave(): void {
    $q.loading.show({
      message: 'Creando usuario...'
    })
    userForm.value.status = true
    createUser(userForm.value as UserInterface).then((response) => {
      const data = crypto.decryptObject(response.data.data)
      notify(`Usuario ${data.name} ${data.last_name} creado con exito!`, 'positive')
      gellAllUser()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
    }).finally(() => $q.loading.hide())

  }

  function editUser(data: UserInterface) {
    userEdit.value = true
    userForm.value = {
      id: data.id as string,
      name: data.name,
      last_name: data.last_name,
      password: data.password as string,
      phone: data.phone as string,
      address: data.address,
      email: data.email,
      rol: data.rol,
      status: data.status ? true : false
    }
  }

  function onUpdate(): void {
    $q.loading.show({
      message: 'Actualizando usuario...'
    })
    updateUser(userForm.value.id as string, userForm.value as UserInterface).then((response) => {
      const data = crypto.decryptObject(response.data.data)
      notify(`El usuario ${data.name} ${data.last_name} actualizado con exito!`, 'positive')
      gellAllUser()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
    }).finally(() => $q.loading.hide())
  }

  function deleteUser(data: UserInterface): void {
    userDelete.value = true
    userName.value = data.name
    userForm.value = {
      id: data.id as string,
      name: data.name,
      last_name: data.last_name,
      password: data.password as string,
      phone: data.phone as string,
      address: data.address,
      email: data.email,
      rol: data.rol,
      status: false
    }
  }

  function onDelete(): void {
    $q.loading.show({
      message: 'inactivando usuario...'
    })
    inactiveUser(userForm.value.id as string, userForm.value as UserInterface).then((response) => {
      const data = crypto.decryptObject(response.data.data)
      notify(`El suario ${data.name} ${data.last_name} inactivado con exito!`, 'positive')
      gellAllUser()
    }).catch(() => {
      notify('Revisar que la información este completa', 'negative')
    }).finally(() => $q.loading.hide())
  }

  function onActiveUser(data: UserInterface): void {
    userActive.value = true
    userName.value = `${data.name} ${data.last_name}`
    userForm.value = {
      id: data.id as string,
      name: data.name,
      last_name: data.last_name,
      password: data.password as string,
      phone: data.phone as string,
      address: data.address,
      email: data.email,
      rol: data.rol,
      status: true
    }
  }

  function onActive(): void {
    $q.loading.show({
      message: 'Activando usuario...'
    })
    activeUser(userForm.value.id as string, userForm.value as UserInterface).then((response) => {
      const data = crypto.decryptObject(response.data.data)
      notify(`El usuario ${data.name} ${data.last_name} activado con exito!`, 'positive')
      gellAllUser()
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

  function onReset() {
    userForm.value = {
      id: null,
      name: null,
      last_name: null,
      password: null,
      phone: null,
      address: null,
      email: null,
      rol: null,
      status: true
    }
  }

  function isValidEmail(val: string) {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || 'El correo no parece ser válido';
  }

  function isValidPassword(val: string) {
    const passwordPattern = /(^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{9,}$)/;
    return (
      passwordPattern.test(val) ||
      'La contraseña no parece ser válida, favor verificar que contenga números, letras y caracteres especiales'
    );
  }
</script>
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      :rows="userList"
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
            @click="editUser(props.row)"
          ></q-btn>
          <q-btn
            dense
            flat
            round
            icon="delete"
            color="red"
            @click="deleteUser(props.row)"
          ></q-btn>
          <q-btn
            :disable="props.row.status"
            dense
            flat
            round
            icon="check_box"
            color="green"
            @click="onActiveUser(props.row)"
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
          label="Agregar Usuario"
          @click="addUser()"
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
    <q-dialog v-model="userCreate" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h5 text-center q-mt-sm text-bold">Crear Usuario</div>
          <hr />
        </q-card-section>
        <q-card-section>
          <q-form ref="form" class="row q-col-gutter-md">
            <div class="col-12 col-sm-12">
              <q-input
                v-model="userForm.name"
                rounded
                outlined
                label="Nombres"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar nombres']"
              />
              <q-input
                v-model="userForm.last_name"
                rounded
                outlined
                label="Apellidos"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar apellidos']"
              />
              <q-input
                v-model="userForm.email"
                rounded
                outlined
                label="Email"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el email', isValidEmail]"
              />
              <q-input
                v-model="userForm.password"
                rounded
                outlined
                label="Contraseña"
                :type="isPwd ? 'password' : 'text'"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar la contraseña', isValidPassword]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off': 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-input
                v-model="userForm.phone"
                rounded
                outlined
                label="Teléfono"
                mask="(###) ### - ####"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el numero telefonico']"
              />
              <q-input
                v-model="userForm.address"
                rounded
                outlined
                label="Dirección"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar dirección']"
              />
              <q-select
                outlined
                rounded
                v-model="userForm.rol"
                emit-value
                :options="roles"
                map-options
                clearable
                label="Seleccionar rol"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor seleccionar rol']"
              />
              <q-checkbox
                v-model="userForm.status"
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
                @click="onUserSave()"
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
    <q-dialog v-model="userEdit" persistent>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h5 text-center q-mt-sm text-bold">
            Editar Usuario
          </div>
          <hr />
        </q-card-section>
        <q-card-section>
          <q-form ref="form" class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="userForm.name"
                rounded
                outlined
                label="Nombres"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar nombres']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="userForm.last_name"
                rounded
                outlined
                label="Apellidos"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar apellidos']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="userForm.email"
                rounded
                outlined
                label="Email"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el email', isValidEmail]"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="userForm.password"
                rounded
                outlined
                label="Contraseña"
                :type="isPwd ? 'password' : 'text'"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar la contraseña', isValidPassword]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off': 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input
                v-model="userForm.phone"
                rounded
                outlined
                label="Teléfono"
                mask="(###) ### - ####"
                hint="Eje: (300) 000 - 0000"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar el numero telefonico']"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="userForm.address"
                rounded
                outlined
                label="Dirección"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor ingresar dirección']"
              />
            </div>
            <div class="col-12">
              <q-select
                outlined
                v-model="userForm.rol"
                emit-value
                :options="roles"
                map-options
                clearable
                label="Seleccionar rol"
                lazy-rules
                :rules="[(val: []) => val && val.length > 0 || 'Favor seleccionar rol']"
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
    <q-dialog v-model="userDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete_forever" color="negative" text-color="white" />
          <span class="q-ml-sm">Desea inactivar el usuario: <strong> {{ userName }} </strong> ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Eliminar" @click="onDelete()" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="userActive" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="check_circle" color="positive" text-color="white" />
          <span class="q-ml-sm">Desea activar el referenciadpr: <strong> {{ userName }} </strong> ?</span>
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
