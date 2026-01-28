// Utility function to delete a card from the course object
export const deleteCard = (course, type, cardId) => {
  const updatedCourse = { ...course };

  switch (type) {
    case "quiz":
      updatedCourse.quizzes = course.quizzes.filter(
        (quiz) => quiz._id !== cardId
      );
      break;

    case "lesson":
      updatedCourse.lessons = course.lessons.filter(
        (lesson) => lesson._id !== cardId
      );
      break;

    case "assignment":
      updatedCourse.assignments = course.assignments.filter(
        (assignment) => assignment._id !== cardId
      );
      break;

    case "content":
      updatedCourse.contentLibrary = course.contentLibrary.filter(
        (content) => content._id !== cardId
      );
      break;

    default:
      break;
  }

  return updatedCourse;
};

// Utility function to edit a card in the course object
export const editCard = (course, type, updatedCard) => {
  const updatedCourse = { ...course };

  switch (type) {
    case "quiz":
      updatedCourse.quizzes = course.quizzes.map((quiz) =>
        quiz._id === updatedCard._id ? updatedCard : quiz
      );
      break;

    case "lesson":
      updatedCourse.lessons = course.lessons.map((lesson) =>
        lesson._id === updatedCard._id ? updatedCard : lesson
      );
      break;

    case "assignment":
      updatedCourse.assignments = course.assignments.map((assignment) =>
        assignment._id === updatedCard._id ? updatedCard : assignment
      );
      break;

    case "content":
      updatedCourse.contentLibrary = course.contentLibrary.map((content) =>
        content._id === updatedCard._id ? updatedCard : content
      );
      break;

    default:
      break;
  }

  return updatedCourse;
};
