import React from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import Animated, {
  useAnimatedRef,
  measure,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
  runOnUI,
} from "react-native-reanimated";
import Checkmark from "./Checkmark";
import ListChildItem from "./ListChildItem";

const LIST_ITEM_HEIGHT = 54;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffd6d6",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#f4f4f6",
    height: LIST_ITEM_HEIGHT,
  },
  name: {
    fontSize: 16,
  },
  pointsContainer: {
    borderRadius: 8,
    backgroundColor: "#44c282",
    padding: 8,
  },
  points: {
    color: "white",
    fontWeight: "bold",
  },
  items: {
    overflow: "hidden",
  },
});

export interface ListItem {
  name: string;
  points: string;
}

interface ListItemProps {
  item: ListItem;
  isLast: boolean;
}

const ListItem = ({ question, isLast }) => {
  const aref = useAnimatedRef<View>();
  const bottomRadius = isLast ? 8 : 0;
  const checkmark = useSharedValue(false);
  const checkmarkProgress = useDerivedValue(() => 
    checkmark.value ? withSpring(1) : withTiming(0)
  );

  const height = useSharedValue(0);
  const headerStyle = useAnimatedStyle(() => ({
    borderBottomLeftRadius: checkmarkProgress.value === 0 ? 8 : 0,
    borderBottomRightRadius: checkmarkProgress.value === 0 ? 8 : 0,
  }));
  const style = useAnimatedStyle(() => ({
    height: height.value * checkmarkProgress.value + 1,
    opacity: checkmarkProgress.value === 0 ? 0 : 1,
  }));

  return (<>
    <Animated.View
      style={[
        styles.container,
        {
          borderBottomLeftRadius: bottomRadius,
          borderBottomRightRadius: bottomRadius,
        },
      ]}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (height.value === 0) {
            runOnUI(() => {
              "worklet";
              height.value = measure(aref).height;
            })();
          }
          checkmark.value = !checkmark.value;
        }}
      >
        <Animated.View style={{marginRight: 30}}>
          <Checkmark {...{ checkmarkProgress }} size={15}/>
        </Animated.View>
      </TouchableWithoutFeedback>
      <Text style={styles.name}>{question.label}</Text>
    </Animated.View>
    <Animated.View style={[styles.items, style]}>
      <View
        ref={aref}
        onLayout={({
            nativeEvent: {
            layout: { height: h },
            },
        }) => console.log()}
      >
      {(question.items || []).map((item, key) => (
          <ListChildItem
            key={key}
            isLast={key === question.items.length - 1}
            {...{ item }}
          />
      ))}
      </View>
    </Animated.View>
  </>);
};

export default ListItem;
