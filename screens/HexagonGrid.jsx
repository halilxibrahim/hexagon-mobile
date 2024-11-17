import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { Text } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const HEXAGON_SIZE = windowWidth / 7;

const CODING_ICONS = ['⌨️', '💻', '🖥️', '📱', '🚀', '⚙️', '💡', '🤖', '👾', '🔥', 
                     '💾', '🔌', '🌐', '📊', '🔍', '🎮', '🔒', '📡', '💫', '⚡️'];

const HONEYCOMB_STRUCTURE = [3, 4, 5, 4, 3];

const HexagonGrid = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const rippleAnimations = useRef(HONEYCOMB_STRUCTURE.reduce((acc, count, colIndex) => {
    for (let rowIndex = 0; rowIndex < count; rowIndex++) {
      acc[`${colIndex}-${rowIndex}`] = new Animated.Value(1);
    }
    return acc;
  }, {})).current;

  const triggerRipple = (targetCol, targetRow) => {
    const animations = [];
    
    HONEYCOMB_STRUCTURE.forEach((count, colIndex) => {
      for (let rowIndex = 0; rowIndex < count; rowIndex++) {
        const distance = Math.sqrt(
          Math.pow(colIndex - targetCol, 2) + Math.pow(rowIndex - targetRow, 2)
        );

        const animation = Animated.sequence([
          Animated.timing(rippleAnimations[`${colIndex}-${rowIndex}`], {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
            delay: distance * 40,
          }),
          Animated.timing(rippleAnimations[`${colIndex}-${rowIndex}`], {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]);
        animations.push(animation);
      }
    });

    Animated.parallel(animations).start();
  };

  // Her bir sütun için toplam genişliği hesapla
  const getColumnWidth = (count) => {
    return count * (HEXAGON_SIZE * 0.85);
  };

  // En geniş sütunun genişliğini bul
  const maxColumnWidth = Math.max(...HONEYCOMB_STRUCTURE.map(count => getColumnWidth(count)));

  const Hexagon = ({ col, row, icon }) => {
    const columnWidth = getColumnWidth(HONEYCOMB_STRUCTURE[col]);
    const offset = (maxColumnWidth - columnWidth) / 2;
    
    const animatedStyle = {
      transform: [{
        scale: rippleAnimations[`${col}-${row}`]
      }],
    };

    return (
      <TouchableOpacity
        onPress={() => triggerRipple(col, row)}
        activeOpacity={0.7}
      >
        <Animated.View 
          style={[
            styles.hexagon,
            animatedStyle,
            isDarkTheme ? styles.hexagonDark : styles.hexagonLight,
            {
              left: row * (HEXAGON_SIZE * 0.85) + offset,
              top: col * (HEXAGON_SIZE * 0.75)
            }
          ]}
        >
          <Text style={styles.icon}>{icon}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDarkTheme ? '#1a1a1a' : '#f0f0f0' }
    ]}>
      <TouchableOpacity
        style={[styles.themeToggle, isDarkTheme ? styles.themeToggleDark : styles.themeToggleLight]}
        onPress={() => setIsDarkTheme(!isDarkTheme)}
      >
        <Text style={styles.icon}>{isDarkTheme ? '🌙' : '☀️'}</Text>
      </TouchableOpacity>
      
      <View style={styles.gridWrapper}>
        <View style={[styles.gridContainer, {
          width: maxColumnWidth,
          height: HONEYCOMB_STRUCTURE.length * HEXAGON_SIZE * 0.75
        }]}>
          {HONEYCOMB_STRUCTURE.map((columnCount, colIndex) => (
            <View key={colIndex} style={styles.column}>
              {Array(columnCount).fill(0).map((_, rowIndex) => (
                <Hexagon
                  key={`${colIndex}-${rowIndex}`}
                  col={colIndex}
                  row={rowIndex}
                  icon={CODING_ICONS[(colIndex * columnCount + rowIndex) % CODING_ICONS.length]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    position: 'relative',
  },
  column: {
    position: 'absolute',
    width: '100%',
  },
  hexagon: {
    width: HEXAGON_SIZE,
    height: HEXAGON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: HEXAGON_SIZE / 6,
    transform: [{ rotate: '30deg' }],
  },
  hexagonLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  hexagonDark: {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  icon: {
    fontSize: HEXAGON_SIZE * 0.4,
    transform: [{ rotate: '-30deg' }],
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  themeToggleLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  themeToggleDark: {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
  },
});

export default HexagonGrid;