import { SessionPayload } from "@/lib/session";

// Helper function to check role presence
const hasRole = (user: SessionPayload, code: string) => user?.roles.includes(code);

// Super User
export const isSuperUser = (user: SessionPayload) => hasRole(user, "SU");

// System Admin
// export const isSystemAdmin = (user: SessionPayload) => ["SA1", "SA2", "SA3", "SA4"].some(code => hasRole(user, code));

// Church Admin
export const isSystemAdmin = {
  creator: (user: SessionPayload) => hasRole(user, "SA1"),
  reader: (user: SessionPayload) => hasRole(user, "SA2"),
  updater: (user: SessionPayload) => hasRole(user, "SA3"),
  deleter: (user: SessionPayload) => hasRole(user, "SA4"),
  controller: (user: SessionPayload) => 
    hasRole(user, "SA1") && hasRole(user, "SA2") && hasRole(user, "SA3") && hasRole(user, "SA4"),
  admin: (user: SessionPayload) => 
    ["1", "2", "3", "4"].some(code => hasRole(user, `AD${code}`)), // Checks if user has any admin role
};
export const isChurchAdmin = {
  creator: (user: SessionPayload) => hasRole(user, "AD1"),
  reader: (user: SessionPayload) => hasRole(user, "AD2"),
  updater: (user: SessionPayload) => hasRole(user, "AD3"),
  deleter: (user: SessionPayload) => hasRole(user, "AD4"),
  controller: (user: SessionPayload) => 
    hasRole(user, "AD1") && hasRole(user, "AD2") && hasRole(user, "AD3") && hasRole(user, "AD4"),
  admin: (user: SessionPayload) => 
    ["1", "2", "3", "4", '5'].some(code => hasRole(user, `AD${code}`)), // Checks if user has any admin role
};

// Function to generate CRUD permissions dynamically
const createRoleCheckers = (prefix: string) => ({
  creator: (user: SessionPayload) => hasRole(user, `${prefix}1`),
  reader: (user: SessionPayload) => hasRole(user, `${prefix}2`),
  updater: (user: SessionPayload) => hasRole(user, `${prefix}3`),
  deleter: (user: SessionPayload) => hasRole(user, `${prefix}4`),
  controller: (user: SessionPayload) => 
    hasRole(user, `${prefix}1`) && hasRole(user, `${prefix}2`) && hasRole(user, `${prefix}3`) && hasRole(user, `${prefix}4`),
  admin: (user: SessionPayload) => 
    ["1", "2", "3", "4","5"].some(code => hasRole(user, `${prefix}${code}`)), // Checks if user has any role for the entity
});

// Permissions for all entities
export const activityRoles = createRoleCheckers("AC");
export const attendanceRoles = createRoleCheckers("AT");
export const classAttendanceRoles = createRoleCheckers("ACT");
export const campusRoles = createRoleCheckers("CAM");
export const cardRoles = createRoleCheckers("CA");
export const churchRoles = createRoleCheckers("CH");
export const classRoles = createRoleCheckers("CL");
export const classSessionRoles = createRoleCheckers("CLS");
export const contractRoles = createRoleCheckers("CO");
export const questionSetRoles = createRoleCheckers("CY");
export const eventRoles = createRoleCheckers("EV");
export const eventOrganizerRoles = createRoleCheckers("EVO");
export const facilityRoles = createRoleCheckers("FA");
export const groupRoles = createRoleCheckers("GR");
export const keyRoles = createRoleCheckers("KE");
export const memberRoles = createRoleCheckers("ME");
export const ministryRoles = createRoleCheckers("MI");
export const musichubRoles = createRoleCheckers("MH");
export const paymentRoles = createRoleCheckers("PA");
export const questionSectionRoles = createRoleCheckers("SEC");
export const relationshipRoles = createRoleCheckers("RP");
export const roomRoles = createRoleCheckers("RO");
export const serviceRoles = createRoleCheckers("SER");
export const sessionRoles = createRoleCheckers("SES");
export const travelhubRoles = createRoleCheckers("TH");
export const userRoles = createRoleCheckers("US");
export const venueRoles = createRoleCheckers("VE");
export const zoneRoles = createRoleCheckers("ZO");

// Special cases with additional permissions (Assigning Roles)
export const eventRegistrationRoles = {
  ...createRoleCheckers("RE"),
  assign: (user: SessionPayload) => hasRole(user, "RE5"),
};

export const groupRolesExtended = {
  ...createRoleCheckers("GR"),
  assign: (user: SessionPayload) => hasRole(user, "GR5"),
};

export const keyRolesExtended = {
  ...createRoleCheckers("KE"),
  assign: (user: SessionPayload) => hasRole(user, "KE5"),
};

export const roomRolesExtended = {
  ...createRoleCheckers("RO"),
  assign: (user: SessionPayload) => hasRole(user, "RO5"),
};


export const canPerformAction = (
  user: SessionPayload,
  action: keyof (typeof isSystemAdmin & typeof isChurchAdmin & ReturnType<typeof createRoleCheckers>),
  entityRoles: { [key: string]: Partial<ReturnType<typeof createRoleCheckers>> }
) => {
  return (
    isSuperUser(user) || 
    (action in isSystemAdmin && isSystemAdmin[action]?.(user)) || 
    (action in isChurchAdmin && isChurchAdmin[action]?.(user)) || 
    Object.values(entityRoles).some(role => action in role && role[action]?.(user))
  );
};


export const canPerformEvent = (
  user: SessionPayload,
  action: keyof (typeof isSystemAdmin  & ReturnType<typeof createRoleCheckers>),
  entityRoles: { [key: string]: Partial<ReturnType<typeof createRoleCheckers>> }
) => {
  return (
    isSuperUser(user) || 
    (action in isSystemAdmin && isSystemAdmin[action]?.(user)) || 
    Object.values(entityRoles).some(role => action in role && role[action]?.(user))
  );
};

export const canPerformAdmin = (
  user: SessionPayload,
  action: keyof (typeof isSystemAdmin  & ReturnType<typeof createRoleCheckers>),
  entityRoles: { [key: string]: Partial<ReturnType<typeof createRoleCheckers>> }
) => {
  return (
    isSuperUser(user) || 
    (action in isSystemAdmin && isSystemAdmin[action]?.(user)) || 
    Object.values(entityRoles).some(role => action in role && role[action]?.(user))
  );
};

