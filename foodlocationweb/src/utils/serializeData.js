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

export const buildExtraDataToAPI = (data = {}) => {
  const str = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join(";");

  return str;
};

export const deserializerData = (keyValuePairs = "") => {
  const result = keyValuePairs
    .split(";")
    .map((pair) => pair.split("="))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

  return result;
};
