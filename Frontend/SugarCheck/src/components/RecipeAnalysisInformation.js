import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../config/colors";

const RecipeAnalysisInformation = ({ nutritionInfo }) => {
  return (
    <View>
      <View style={styles.recipeContainer}>
        <Text style={styles.recipeTitle}>Recipe Information</Text>

        {nutritionInfo.calories && (
          <Text style={styles.recipeText}>
            {`Calories: ${nutritionInfo.calories} kcal`}
          </Text>
        )}

        {nutritionInfo.cuisineType && (
          <Text style={styles.recipeText}>
            {`Cuisine Type: ${nutritionInfo.cuisineType}`}
          </Text>
        )}

        {nutritionInfo.dishType && (
          <Text style={styles.recipeText}>
            {`Dish Type: ${nutritionInfo.dishType}`}
          </Text>
        )}

        {nutritionInfo.mealType && (
          <Text style={styles.recipeText}>
            {`Meal Type: ${nutritionInfo.mealType}`}
          </Text>
        )}

        {nutritionInfo.dietLabels && (
          <Text style={styles.recipeText}>
            {`Diet Labels: ${nutritionInfo.dietLabels.join(", ")}`}
          </Text>
        )}
      </View>

      <View style={styles.nutritionContainer}>
        <Text style={styles.nutritionTitle}>Nutritional Information</Text>

        {nutritionInfo.totalNutrients?.ENERC_KCAL?.quantity > 0 && (
          <View
            style={[
              styles.tableRow,
              { borderTopWidth: 1, borderBottomColor: colors.darkBlue },
            ]}
          >
            <Text style={styles.tableCell}>Calories:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.ENERC_KCAL.quantity)}
              kcal
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.FAT?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Fat:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.FAT.quantity)}g
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.CHOCDF?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Carbohydrates:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.CHOCDF.quantity)}g
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.PROCNT?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Protein:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.PROCNT.quantity)}g
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.FIBTG?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Fiber:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.FIBTG.quantity)}g
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.SUGAR?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Sugars:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.SUGAR.quantity)}g
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.CHOLE?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Cholesterol:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.CHOLE.quantity)}mg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.NA?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Sodium:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.NA.quantity)}mg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.K?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Potassium:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.K.quantity)}mg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.CA?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Calcium:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.CA.quantity)}mg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.FE?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Iron:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.FE.quantity)}mg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.VITC?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Vitamin C:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.VITC.quantity)}mg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.VITA_RAE?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Vitamin A:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.VITA_RAE.quantity)}μg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.VITD?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Vitamin D:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.VITD.quantity)}μg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.TOCPHA?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Vitamin E:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.TOCPHA.quantity)}mg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.VITK1?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Vitamin K:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.VITK1.quantity)}μg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.THIA?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Vitamin B1:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.THIA.quantity)}mg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.RIBF?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Vitamin B2:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.RIBF.quantity)}mg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.NIA?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Vitamin B3:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.NIA.quantity)}mg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.VITB6A?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Vitamin B6:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.VITB6A.quantity)}mg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.VITB12?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Vitamin B12:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.VITB12.quantity)}μg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.FOLDFE?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Folate:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.FOLDFE.quantity)}μg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.FOLAC?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Folic Acid:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.FOLAC.quantity)}μg
            </Text>
          </View>
        )}

        {nutritionInfo.totalNutrients?.FAMS?.quantity > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Fatty Acids:</Text>
            <Text style={styles.tableCell}>
              {Math.round(nutritionInfo.totalNutrients.FAMS.quantity)}g
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nutritionContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 5,
  },
  recipeContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 5,
  },
  recipeTitle: {
    fontFamily: "MontserratBold",
    fontSize: 22,
    color: colors.darkBlue,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBlue,
  },
  recipeText: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
    marginBottom: 10,
  },
  nutritionTitle: {
    fontFamily: "MontserratBold",
    fontSize: 22,
    color: colors.darkBlue,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBlue,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.darkBlue,
  },

  tableCell: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    color: colors.darkBlue,
  },
});

export default RecipeAnalysisInformation;
