import {StyleSheet, View, useWindowDimensions} from 'react-native';
import React from 'react';
import 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedGestureHandler,
  useDerivedValue,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  gestureHandlerRootHOC,
  PanGestureHandlerEventPayload,
  GestureEvent,
} from 'react-native-gesture-handler';
import {UserTypeProps} from '../../assets/data/users';
import TinderCard from '../TinderCard';

const ROTATION = 60;
const SWIPE_VELOCITY = 500;

export interface AnimatedStackProps {
  data: UserTypeProps[];
  onSwipeLeft: (data:any) => void;
  onSwipeRight: (data:any) => void;
}

const AnimatedStack = gestureHandlerRootHOC(
  ({data, onSwipeLeft, onSwipeRight}: AnimatedStackProps) => {
    const LIKE = require('../../assets/images/LIKE.png');
    const NOPE = require('../../assets/images/nope.png');
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [nextIndex, setNextIndex] = React.useState(currentIndex + 1);
    const currentProfile = data[currentIndex];
    const nextProfile = data[nextIndex];
    const {width: screenWidth} = useWindowDimensions();

    const hiddenTranslateX = 2 * screenWidth;

    const translateX = useSharedValue(0);
    const rotate = useDerivedValue(
      () =>
        interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
        'deg',
    );

    const CardStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: withSpring(translateX.value),
        },
        {
          rotate: rotate.value,
        },
      ],
    }));
    const nextCardStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: interpolate(
            translateX.value,
            [-hiddenTranslateX, 0, hiddenTranslateX],
            [1, 0.8, 1],
          ),
        },
      ],
      opacity: interpolate(
        translateX.value,
        [-hiddenTranslateX, 0, hiddenTranslateX],
        [1, 0.5, 1],
      ),
    }));

    const LikeAnimation = useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [0, hiddenTranslateX / 10],
        [0, 1],
      ),
    }));
    const NopeAnimation = useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [0, -hiddenTranslateX / 10],
        [0, 1],
      ),
    }));

    const gestureHandler = useAnimatedGestureHandler<
      GestureEvent<PanGestureHandlerEventPayload>,
      Record<string, number>
    >({
      onStart: (_, ctx) => {
        ctx.startX = translateX.value;
      },

      onActive: (ev, ctx) => {
        translateX.value = ctx.startX + ev.translationX;
        // console.log('Touch x', ev.translationX);
      },
      onEnd: event => {
        if (Math.abs(event.velocityX) < SWIPE_VELOCITY) {
          translateX.value = withSpring(0);
          return;
        }

        translateX.value = withSpring(
          hiddenTranslateX * Math.sign(event.velocityX),
          {},
          () => runOnJS(setCurrentIndex)(currentIndex + 1),
        );

        const onSwipe = event.velocityX > 0 ? onSwipeRight : onSwipeLeft;
        runOnJS(onSwipe)(currentProfile)
      },
    });

    React.useEffect(() => {
      translateX.value = 0;
      setNextIndex(currentIndex + 1);
    }, [currentIndex, translateX]);

    return (
      <View style={styles.pageContainer}>
        {nextProfile && (
          <View style={styles.nextAnimatedCard}>
            <Animated.View style={[nextCardStyle, styles.animatedCard]}>
              <TinderCard
                items={nextProfile}
                name={nextProfile.name}
                id={nextProfile.id}
                image={nextProfile.image}
                bio={nextProfile.bio}
              />
            </Animated.View>
          </View>
        )}
        {currentProfile && (
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[CardStyle, styles.animatedCard]}>
              <Animated.Image
                source={LIKE}
                style={[styles.Like, {left: 10}, LikeAnimation]}
                resizeMode="contain"
              />
              <Animated.Image
                source={NOPE}
                style={[styles.Like, {right: 10}, NopeAnimation]}
                resizeMode="contain"
              />

              <TinderCard
                items={currentProfile}
                name={currentProfile.name}
                id={currentProfile.id}
                image={currentProfile.image}
                bio={currentProfile.bio}
              />
            </Animated.View>
          </PanGestureHandler>
        )}
      </View>
    );
  },
);

export default AnimatedStack;

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  animatedCard: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  nextAnimatedCard: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  Like: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: 10,
    zIndex: 1,
  },
  Nope: {},
});
