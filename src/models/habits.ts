import * as yup from 'yup';

export const HabitSchema = yup.object({
    id_habit: yup.string().required(),
    name: yup.string().required(),
    description: yup.string().required(),
    id_user: yup.string().required(),
});

export const FilterHabitSchema = yup.object({
    id_habit: yup.string().required(),
});