import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  formData: {
    name: "",
    description: "",
    price: "",
    thumbnail: "",
    language: "",
    courseType: "Recorded",
    courseLevel: "Beginner",
    duration: "",
    lessons: [],
    tags: [],
    assignments: [],
    quizzes: [],
    liveSchedule: {
      startDate: "",
      endDate: "",
      daysOfWeek: [],
      startTime: "", // Single time slot
      endTime: "", // Single time slot
    },
    oneToOneSchedules: [
      {
        daysOfWeek: [],
        schedules: [
          {
            startTime: "",
            endTime: "",
          },
        ],
      },
    ],
  },
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      // Handle both object updates and direct field updates
      if (typeof action.payload === "function") {
        const updatedData = action.payload(state.formData);
        state.formData = updatedData;
      } else if (action.payload.field && action.payload.value !== undefined) {
        // Handle field/value pairs
        state.formData[action.payload.field] = action.payload.value;
      } else {
        // Handle direct key/value updates
        const { name, value } = action.payload;
        if (name) {
          state.formData[name] = value;
        }
      }
    },
    updateStep(state, action) {
      state.step = action.payload;
    },
    resetCourse(state) {
      // Reset the formData and step to the initial state
      state.step = initialState.step;
      state.formData = { ...initialState.formData };
    },
  },
});

export const { updateFormData, updateStep, resetCourse } = courseSlice.actions;

export default courseSlice.reducer;
