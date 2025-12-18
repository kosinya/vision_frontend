<script>
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
  name: 'OrganizationsView',
  components: {
    Dialog,
    InputText,
    Button
  },
  data() {
    return {
      // Видимость диалогового окна
      visible: false,
      // Название новой организации
      newOrgName: '',
      // Список организаций
      // TODO: Удалить добавлении API
      organizations: [
        {
          id: 1,
          name: 'ООО "Сетевая Безопасность"',
          createdAt: '2023-05-15',
          address: 'г. Москва, ул. Тверская, д. 10, офис 505',
          status: 'active',
          image: "https://lh3.googleusercontent.com/proxy/wpWvQp15zavv8XSTZFyWFIzO-CtXFes3DwmJxPlQyZWaWXPF0CzSak_3eZ_AqA694xkq4Dajf-023obV-1UKoDxHlimktr3thw"
        },
        {
          id: 1,
          name: 'ООО "Сетевая Безопасность"',
          createdAt: '2023-05-15',
          address: 'г. Москва, ул. Тверская, д. 10, офис 505',
          status: 'active',
          image: "https://bfkh.ru/upload/iblock/8a3/1g6k7128t2o22et0l85aaq3prd9f83y1/Otkrytie-_1_.png"
        },
        {
          id: 1,
          name: 'ООО "Сетевая Безопасность"',
          createdAt: '2023-05-15',
          address: 'г. Москва, ул. Тверская, д. 10, офис 505',
          status: 'active',
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsxWEdquta-3nqXkjvakLXLgcY65ZRExOgaA&s"
        }
      ]
    }
  },
  methods: {
    createOrganization() {
      if (!this.newOrgName) return;

      const newOrg = {
        id: Date.now(),
        name: this.newOrgName,
        createdAt: new Date().toISOString(),
        // Копирование остальных полей
        address: 'г. Москва, ул. Тверская, д. 10, офис 505',
        status: 'active'
      };

      this.organizations.push(newOrg);
      // Сброс данных
      this.newOrgName = '';
      this.visible = false;
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  }
}
</script>

<template>
  <div class="flex gap-2">
    <div class="flex w-full">
      <input-text class="w-full border-0 border-round-xl" placeholder="Введите данные для поиска..."></input-text>
    </div>

    <button class="p-2 inline-flex align-items-center border-round-xl cursor-pointer bg-white border-none shadow-1 text-900">
      <i class="pi pi-search mr-1"></i>
      <span>Поиск</span>
    </button>

    <button class="p-2 inline-flex align-items-center border-round-xl cursor-pointer bg-white border-none shadow-1 text-900">
      <i class="pi pi-filter mr-1"></i>
      <span>Фильтры</span>
    </button>

    <!-- Кнопка для добавления организации -->
    <div class="flex justify-content-end">
      <button
          @click="visible = true"
          class="pi pi-plus p-2 border-round-xl cursor-pointer bg-white border-none shadow-1 text-900"
          title="Добавить"
      ></button>
    </div>

  </div>

  <!-- Диалоговое окно для создания организации -->
  <Dialog
      v-model:visible="visible"
      modal
      header="Введите имя"
      :style="{ width: '20rem' }"
  >
    <div class="flex flex-column gap-3">
      <InputText v-model="newOrgName" placeholder="Название организации" class="w-full" />
      <div class="flex justify-content-end">
        <Button label="Создать" @click="createOrganization" />
      </div>
    </div>
  </Dialog>

  <div v-for="organization in organizations"
      :key="organization.id"
      class="flex flex-row glass-effect p-3 border-round-xl mt-2"
  >
    <img
        alt="organization logo"
        class="w-1 mr-4 border-round object-fill"
        :src="organization.image"
    />

    <!-- Информация справа -->
    <div class="flex flex-column gap-2 w-full">
      <!-- Заголовок и статус -->
      <div class="flex justify-content-between align-items-start">
        <div>
          <h3 class="text-xl font-bold">{{ organization.name }}</h3>
          <div class="flex align-items-center">
            <i class="pi pi-calendar mr-2 text-sm"></i>
            <span>Создана: {{ formatDate(organization.createdAt) }}</span>
          </div>
        </div>
        <div class="flex align-items-center ml-auto">
          <i class="pi pi-circle-fill mr-2 text-green-400"></i>
          <span class="text-sm">Активна</span>
        </div>
      </div>

      <!-- Адрес -->
      <div class="flex align-items-center">
        <i class="pi pi-map-marker mr-2"></i>
        <div class="text-sm">Адрес: {{ organization.address }}</div>
      </div>

      <!-- Кнопки действий -->
        <div class="flex gap-2 mt-auto">
          <button class="p-2 border-0 border-round cursor-pointer bg-blue-100">
            <i class="pi pi-cog mr-2"></i>
            <span>Настройки</span>
          </button>
          <button class="p-2 border-0 border-round cursor-pointer bg-blue-100">
            <i class="pi pi-chart-bar mr-2"></i>
            <span>Аналитика</span>
          </button>
        </div>
    </div>
  </div>
</template>

<style scoped>
</style>