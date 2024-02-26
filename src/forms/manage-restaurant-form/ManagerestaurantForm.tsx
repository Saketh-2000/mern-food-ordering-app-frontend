import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailSection from "./DetailSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import ImageSection from "./ImageSection";
import { Restaurant } from "@/Types";
import { useEffect } from "react";

const formSchema = z
  .object({
    restaurantName: z.string({
      required_error: "restaurant name is required",
    }),
    city: z.string({
      required_error: "city is required",
    }),
    country: z.string({
      required_error: "country is required",
    }),
    deliveryPrice: z.coerce.number({
      required_error: "estimated  price is required",
      invalid_type_error: "must be a valid number",
    }),
    estimatedDeliveryTime: z.coerce.number({
      required_error: "estimated delivery time is required",
      invalid_type_error: "must be a valid number",
    }),
    cuisines: z.array(z.string()).nonempty({
      message: "please select at least one",
    }),
    menuItems: z.array(
      z.object({
        name: z.string().min(1, "name is required"),
        price: z.coerce.number().min(1, "price is required"),
      })
    ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "image is required" }).optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either Image URL or image File must be provided",
    path: ["imageFile"],
  });
type RestaurantFormData = z.infer<typeof formSchema>;
type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantformData: FormData) => void;
  isLoading: boolean;
};

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  });

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    // price lowest domination of 100 = 100pence == 1GBP
    const deliveryPriceFormatted = parseInt(
      (restaurant.deliveryPrice / 100).toFixed(2)
    );

    const menuItemsFormatted = restaurant.menuItems.map((item) => ({
      ...item,
      price: parseInt((item.price / 100).toFixed(2)),
    }));

    const updatedRestaurant = {
      ...restaurant,
      deliveryPrice: deliveryPriceFormatted,
      menuItems: menuItemsFormatted,
    };

    form.reset(updatedRestaurant);
  }, [form, restaurant]);

  console.log("formState", form.formState);
  const onSubmit = (formDataJson: RestaurantFormData) => {
    const formData = new FormData();

    formData.append("restaurantName", formDataJson.restaurantName);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);

    formData.append(
      "deliveryPrice",
      (formDataJson.deliveryPrice * 100).toString()
    );
    formData.append(
      "estimatedDeliveryTime",
      formDataJson.estimatedDeliveryTime.toString()
    );
    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
    formDataJson.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(
        `menuItems[${index}][price]`,
        (menuItem.price * 100).toString()
      );
    });

    if (formDataJson.imageFile) {
      formData.append(`imageFile`, formDataJson.imageFile);
    }

    onSave(formData);
  };
  // const onSubmit = (formDataJson: RestaurantFormData) => {

  //   const formData = new FormData();

  //   formData.append("restaurantName", formDataJson.restaurantName);
  //   formData.append("city", formDataJson.city);
  //   formData.append("country", formDataJson.country);
  //   formData.append(
  //     "deliveryPrice",
  //     (formDataJson.deliveryprice * 100).toString()
  //   );
  //   formData.append(
  //     "estimatedDeliveryTime",
  //     formDataJson.estimatedDeliveryTime.toString()
  //   );
  //   formDataJson.cuisines.forEach((cuisine, index) => {
  //     formData.append(`cuisines[${index}]`, cuisine);
  //   });
  //   formDataJson.menuItems.forEach((menuItem, index) => {
  //     formData.append(`menuItems[${index}[name]`, menuItem.name);
  //     formData.append(
  //       `menuItems[${index}][price]`,
  //       (menuItem.price * 100).toString()
  //     );
  //   });

  //   if (formDataJson.imageFile) {
  //     formData.append(`imageFile`, formDataJson.imageFile);
  //   }
  //   onSave(formData);
  // };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-gray-50 p-10 rounded-lg"
      >
        <DetailSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? <LoadingButton /> : <Button type="submit">submit</Button>}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
