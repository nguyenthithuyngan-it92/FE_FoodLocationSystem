export const dataFoodToFE = (foodList = []) => {
  const result = [];
  if (foodList.length === 0) return result;

  foodList.forEach((foodItem) => {
    const { menu_item = {}, ...restFoodInfo } = foodItem;
    const temp = {
      ...menu_item,
      foods: [restFoodInfo],
    };

    const indexFood = result.findIndex((item) => item.id === temp.id);
    if (indexFood === -1) {
      result.push(temp);
    } else if (result[indexFood]) {
      result[indexFood].foods.push(restFoodInfo);
    }
  });

  return result;
};
