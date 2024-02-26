import {
  useCreatemyRestaurant,
  UseGetMyRestaurant,
  useUpdateMyRestaurant,
} from "@/api/MyRestaurantApi";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManagerestaurantForm";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: isCreateloading } =
    useCreatemyRestaurant();
  const { restaurant } = UseGetMyRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } =
    useUpdateMyRestaurant();
  const isEditing = !!restaurant;
  return (
    <ManageRestaurantForm
      restaurant={restaurant}
      onSave={isEditing ? updateRestaurant : createRestaurant}
      isLoading={isCreateloading || isUpdateLoading}
    />
  );
};

export default ManageRestaurantPage;
