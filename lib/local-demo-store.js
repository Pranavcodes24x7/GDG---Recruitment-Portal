const store = globalThis.__recruitmentLocalDemoStore || {
  profiles: new Map(),
  applications: new Map(),
};

globalThis.__recruitmentLocalDemoStore = store;

export const localDemoEnabled = () => process.env.AUTH_LOCAL_DEMO === "true";

export function getDemoProfile(userId) {
  return store.profiles.get(userId) || null;
}

export function getDemoApplications(userId) {
  return [...store.applications.values()]
    .filter((application) => application.userId === userId)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export function saveDemoSubmission({ user, profile, applications, requestId, applicationId, applicationLimit }) {
  const records = applications.map((application) => ({
    id: applicationId(user.id, application.departmentId),
    application,
  }));
  const existing = records.map(({ id }) => store.applications.get(id)).filter(Boolean);

  if (existing.length) {
    const isRetry = existing.length === records.length && existing.every((record) => record.requestId === requestId);
    if (isRetry) return { idempotentRetry: true };
    throw Object.assign(new Error("You have already submitted an application for one of those departments."), { status: 409 });
  }

  const previousProfile = getDemoProfile(user.id);
  const priorDepartmentIds = previousProfile?.departmentIds || [];
  const priorDepartmentNames = previousProfile?.departmentNames || [];
  if (priorDepartmentIds.length + applications.length > applicationLimit) {
    throw Object.assign(new Error(`You can apply to up to ${applicationLimit} departments.`), { status: 409 });
  }

  const now = new Date().toISOString();
  store.profiles.set(user.id, {
    userId: user.id,
    email: user.email,
    departmentIds: [...priorDepartmentIds, ...applications.map((application) => application.departmentId)],
    departmentNames: [...priorDepartmentNames, ...applications.map((application) => application.department)],
    createdAt: previousProfile?.createdAt || now,
    updatedAt: now,
  });

  records.forEach(({ id, application }) => {
    store.applications.set(id, {
      id,
      userId: user.id,
      email: user.email,
      profile,
      departmentId: application.departmentId,
      department: application.department,
      answers: application.answers,
      status: "submitted",
      shortlisted: false,
      formVersion: 2,
      requestId,
      createdAt: now,
      updatedAt: now,
    });
  });

  return { idempotentRetry: false };
}
