export const formatGender = (gender, t) => {
    switch (gender) {
        case 'male':
            return t("male");
        case 'female':
            return t("female");
        default:
            return t("unknown");
    }
}

export const formatRelationshipStatus = (relationship_status, t) => {
    switch (relationship_status) {
        case 'single':
            return t("single");
        case 'in_a_relationship':
            return t("in_relationship");
        case 'married':
            return t("married");
        default:
            return t("unknown");
    }
}

export const formatRole = (role_enum, t) => {
    switch (role_enum) {
        case 1:
            return t("role_user");
        case 2:
            return t("role_admin");
        default:
            return t("unknown");
    }
}

export const genderToEnum = (gender) => {
    switch (gender) {
        case 'male':
            return 0;
        case 'female':
            return 1;
        default:
            return null;
    }
}

export const relationshipStatusToEnum = (relationship_status) => {
    switch (relationship_status) {
        case 'single':
            return 0;
        case 'in_a_relationship':
            return 1;
        case 'married':
            return 2;
        default:
            return null;
    }
}