import { createRouter, createWebHistory } from 'vue-router'

// Импортируем компоненты
const OrganizationsView = () => import('@/views/OrganizationsView.vue')
const TasksView = () => import('@/views/TasksView.vue')
const ReportingView = () => import('@/views/ReportingView.vue')
const OrganizationSettingsView = () => import('@/views/OrganizationSettingsView.vue')
const TaskSettingView = () => import('@/views/TaskSettingsView.vue')

const routes = [
    {
        path: '/organizations',
        name: 'organizations',
        component: OrganizationsView,
        meta: { title: 'Организации' }
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: TasksView,
        meta: { title: 'Задачи' }
    },
    {
        path: '/reporting',
        name: 'reporting',
        component: ReportingView,
        meta: { title: 'Отчеты' }
    },
    {
        path: '/organizations/:id/cameras',
        name: 'org-cameras',
        component: OrganizationSettingsView,
        meta: { title: 'Настройки организации' },
        props: true,
    },
    {
        path: '/tasks/:id',
        name: 'task-setting',
        component: TaskSettingView,
        meta: { title: 'Задача' },
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router