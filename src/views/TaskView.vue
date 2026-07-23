<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaskStore } from "../stores/task";
import BaseModal from "../components/BaseModal.vue";
import { initFlowbite } from "flowbite";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();
const projectId = route.params.projectId;
const editingTask = ref(null);
const showModal = ref(false);
const titleTask = ref(null);
const descriptionTask = ref(null);
const dueDateTask = ref(null);
const statusTask = ref(null);
const errors = ref("");
const toast = useToast();
const statusOptions = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "In Progress",
    value: "in_progress",
  },
  {
    label: "Completed",
    value: "completed",
  },
];

const goBack = () => {
  router.back();
};

onMounted(async () => {
  await taskStore.fetchTasks(projectId);
  initFlowbite();
});

function closeModal() {
  showModal.value = false;
}
function openCreate() {
  editingTask.value = null;
  showModal.value = true;
  titleTask.value = null;
  descriptionTask.value = null;
  statusTask.value = statusOptions[0].value;
  dueDateTask.value = null;
}
function openEdit(task) {
  editingTask.value = task;
  showModal.value = true;
  titleTask.value = task.title;
  descriptionTask.value = task.description;
  statusTask.value = task.status;
  dueDateTask.value = task.due_date;
}

async function submit() {
  errors.value = "";
  try {
    if (editingTask.value) {
      await taskStore.updateTask(
        editingTask.value.id,
        titleTask.value,
        descriptionTask.value,
        statusTask.value,
        dueDateTask.value,
      );
      toast.success("Task updated successfully");
    } else {
      await taskStore.createTask(
        projectId,
        titleTask.value,
        descriptionTask.value,
        statusTask.value,
        dueDateTask.value,
      );
      toast.success("Task created successfully");
    }
    closeModal()
  } catch (err) {
    errors.value = err.errors;
    if (!errors.value) {
      toast.error(err.message);
    }
  }
}
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between mb-4">
      <button
        class="py-3 px-10 text-white bg-gray-500 rounded-md cursor-pointer"
        @click="goBack"
      >
        Back
      </button>

      <button
        @click="openCreate"
        class="py-3 px-10 text-white bg-blue-500 rounded-md"
        :disabled="taskStore.loading.fetch"
        :class="
          taskStore.loading.fetch
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
        "
      >
        Create task
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-auto rounded-2xl border border-gray-300 shadow-md">
      <table class="w-full text-md text-center table-auto">
        <thead class="text-body bg-neutral-100 border-b border-gray-300">
          <tr>
            <th class="px-6 py-3 font-medium">Title</th>
            <th class="px-6 py-3 font-medium">Description</th>
            <th class="px-6 py-3 font-medium">Due Date</th>
            <th class="px-6 py-3 font-medium">Status</th>
            <th class="px-6 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody v-if="taskStore.loading.fetch">
          <tr v-for="i in 5" :key="i">
            <td colspan="5" class="px-6 py-3 border-b border-gray-300">
              <div class="animate-pulse h-6 w-full rounded bg-gray-200"></div>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="!taskStore.tasks.length">
          <tr>
            <td colspan="5" class="text-center py-8">No Data Found</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr
            v-for="task in taskStore.tasks"
            :key="task.id"
            class="border-b border-gray-400"
          >
            <td class="px-6 py-3">{{ task.title }}</td>
            <td class="px-6 py-3">{{ task.description }}</td>
            <td class="px-6 py-3">{{ task.due_date }}</td>
            <td>
              <div
                class="px-1 py-2 rounded-md font-semibold text-white"
                :class="
                  task.status?.toLowerCase() === 'completed'
                    ? 'bg-green-400'
                    : task.status?.toLowerCase() === 'pending'
                      ? 'bg-yellow-400'
                      : task.status?.toLowerCase() === 'in_progress'
                        ? 'bg-blue-400'
                        : 'bg-red-400'
                "
              >
                {{
                  task.status?.toLowerCase() === "completed"
                    ? "Completed"
                    : task.status?.toLowerCase() === "pending"
                      ? "Pending"
                      : task.status?.toLowerCase() === "in_progress"
                      ? "In Progress" : "Not Found"
                }}
              </div>
            </td>
            <td class="px-6 py-3">
              <div class="flex justify-evenly">
                <div
                  class="p-2 bg-orange-400 rounded-lg cursor-pointer"
                  @click="openEdit(task)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path
                      d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"
                    />
                  </svg>
                </div>
                <div class="p-2 bg-red-400 rounded-lg cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Update modal -->
    <BaseModal :show="showModal">
      <div>
        <div class="flex justify-between">
          <h2 class="font-bold text-xl mb-4">
            {{ editingTask ? "Edit Task" : "Create Task" }}
          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 cursor-pointer"
            @click="closeModal"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Title"
          class="flex px-2 py-1 w-full border-2 border-gray-300 mb-4 rounded-md"
          v-model="titleTask"
          :class="errors.title ? 'border-red-300' : ''"
        />
        <div v-if="errors.title" class="text-red-500 mb-2 -mt-2">
          {{ errors.title[0] }}
        </div>
        <textarea
          type="textarea"
          placeholder="Description"
          class="flex px-2 py-1 w-full border-2 border-gray-300 mb-4 rounded-md"
          v-model="descriptionTask"
          :class="errors.description ? 'border-red-300' : ''"
        >
        </textarea>
        <div v-if="errors.description" class="text-red-500 mb-2 -mt-2">
          {{ errors.description[0] }}
        </div>
        <VueDatePicker
          v-model="dueDateTask"
          placeholder="Select date"
          :enable-time-picker="false"
          model-type="yyyy-MM-dd"
          class="w-full mb-4 rounded-md border-gray-300 border"
          :class="errors.due_date ? 'border-red-300':''" 
        >
        </VueDatePicker>
        <div v-if="errors.due_date" class="text-red-500 mb-2 -mt-2">
          {{ errors.due_date[0] }}
        </div>
        <select
          v-model="statusTask"
          class="w-full border-2 border-gray-300 px-2 py-1 rounded-md mb-4"
          :class="errors.status ? 'border-red-300':''"
        >
          <option
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <div v-if="errors.status" class="text-red-500 mb-2 -mt-2">
          {{ errors.status[0] }}
        </div>
        <div class="flex justify-end">
          <button
            class="flex items-center px-6 py-2  text-white rounded-md cursor-pointer"
            @click="submit"
            :disabled="taskStore.loading.create || taskStore.loading.update"
            :class="editingTask ? 'bg-yellow-500 hover:bg-yellow-600': 'bg-blue-500 hover:bg-blue-600'"

          >
            <svg v-if="taskStore.loading.create || taskStore.loading.update" 
            class="mr-2 size-5 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" viewBox="0 0 24 24"
            :class="taskStore.loading.create ? 'border-t-blue-500':'border-t-yellow-500'"
            >
            </svg>
            {{ editingTask ? "Update" : "Create" }}
          </button>
        </div>
      </div>
    </BaseModal>  
  </div>
</template>
