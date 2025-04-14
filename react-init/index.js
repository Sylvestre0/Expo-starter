#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

inquirer
  .prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '📦 Qual o nome do projeto?',
      default: 'my-app',
    },
  ])
  .then(({ projectName }) => {
    const root = path.join(process.cwd(), projectName);

    if (!fs.existsSync(root)) {
      fs.mkdirSync(root);
      console.log(`📁 Projeto criado: ${projectName}`);
    }

    const dirs = [
      'src',
      'src/components',
      'src/screens',
      'src/services',
      'src/hooks',
      'src/theme',
      'src/utils',
      'src/app',
      'src/assets',
      'src/assets/fonts',
      'src/assets/images',
      'src/app/router'
    ];

    dirs.forEach(dir => {
      const fullPath = path.join(root, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Criado: ${dir}`);
      }
    });

    const layoutContent = `
    import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
    import { Stack } from 'expo-router';
    import { StatusBar } from 'expo-status-bar';
    import 'react-native-reanimated';

    import { useColorScheme } from 'react-native';
    import { useCustomFonts } from '@/assets/fonts/fonts';

    export default function RootLayout() {
    const colorScheme = useColorScheme();
    const loaded = useCustomFonts();

    if (!loaded) return null;

    return (
        <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="index" />
            </Stack>
            <StatusBar style="auto" />  
        </ThemeProvider>
    );
    }
    `;

    const indexContent = `
    import { View, Text, StyleSheet, Button } from 'react-native';
    import { useRouter } from 'expo-router';

    export default function Home() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello World!</Text>
            <Button title="Ir para a segunda tela" onPress={() => router.push('/router/secondscreen')} />
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    text: {
        fontSize: 18,
    },
    });
    `;

    const secondScreen = `
    import { View, Text, StyleSheet } from 'react-native';

    export default function SecondScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Essa é a segunda tela!</Text>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    });
    `;

    const fontsContent = `
    import * as SplashScreen from 'expo-splash-screen';
    import { useEffect } from 'react';
    import { useFonts } from 'expo-font';

    SplashScreen.preventAutoHideAsync();

    export function useCustomFonts() {
    const [fontsLoaded] = useFonts({
        SpaceMono: require('./SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded) {
        SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    return fontsLoaded;
    }
    `;

    const declarationContent = `
    // declarations.d.ts
    declare module '*.jpg' {
    const value: any;
    export default value;
    }

    declare module '*.png' {
    const value: any;
    export default value;
    }

    declare module '*.svg' {
    const value: any;
    export default value;
    }
    
    declare module '*.ttf' {
    const value: any;
    export default value;
    }
    `;

    const tsconfigContent = `
    {
    "extends": "expo/tsconfig.base",
    "compilerOptions": {
        "jsx": "react-native",
        "baseUrl": "./",
        "paths": {
        "@/*": ["src/*"]
        }
    },
    "include": [
        "**/*.ts",
        "**/*.tsx",
        ".expo/types/**/*.ts",
        "expo-env.d.ts",
        "src",
        "declarations.d.ts"
    ]
    }
    `;

    const expoEnvContent = `
    /// <reference types="expo/types" />
    // NOTE: This file should not be edited and should be in your git ignore
    `;

    const gitignoreContent = `
    node_modules
    .expo
    .expo-shared
    dist
    .env
    *.log
    expo-env.d.ts
    `;
    const packageJsonContent = `
    {
    "name": "${projectName}",
    "main": "expo-router/entry",
    "version": "1.0.0",
    "scripts": {
        "start": "expo start",
        "reset-project": "node ./scripts/reset-project.js",
        "android": "expo start --android",
        "ios": "expo start --ios",
        "web": "expo start --web",
        "test": "jest --watchAll",
        "lint": "expo lint"
    },
    "jest": {
        "preset": "jest-expo"
    },
    "dependencies": {
        "@expo/vector-icons": "^14.0.2",
        "@react-navigation/bottom-tabs": "^7.2.0",
        "@react-navigation/native": "^7.0.14",
        "expo": "~52.0.42",
        "expo-blur": "~14.0.3",
        "expo-constants": "~17.0.8",
        "expo-font": "~13.0.4",
        "expo-haptics": "~14.0.1",
        "expo-linking": "~7.0.5",
        "expo-router": "~4.0.20",
        "expo-splash-screen": "~0.29.22",
        "expo-status-bar": "~2.0.1",
        "expo-symbols": "~0.2.2",
        "expo-system-ui": "~4.0.8",
        "expo-web-browser": "~14.0.2",
        "react": "18.3.1",
        "react-dom": "18.3.1",
        "react-native": "0.76.9",
        "react-native-gesture-handler": "~2.20.2",
        "react-native-reanimated": "~3.16.1",
        "react-native-safe-area-context": "4.12.0",
        "react-native-screens": "~4.4.0",
        "react-native-web": "~0.19.13",
        "react-native-webview": "13.12.5"
    },
    "devDependencies": {
        "@babel/core": "^7.25.2",
        "@types/jest": "^29.5.12",
        "@types/react": "~18.3.12",
        "@types/react-test-renderer": "^18.3.0",
        "jest": "^29.2.1",
        "jest-expo": "~52.0.6",
        "react-test-renderer": "18.3.1",
        "typescript": "^5.3.3"
    },
    "private": true
    }

    `;
    const routerSecondScreenContent = `
    import SecondScreen from '@/screens/second';

    export default function Screen() {
    return <SecondScreen />;
    }
    `;

    const routerDir = path.join(root, 'src', 'app', 'router');

    fs.writeFileSync(path.join(routerDir, 'secondscreen.tsx'), routerSecondScreenContent);
    fs.writeFileSync(path.join(root, 'package.json'), packageJsonContent);
    fs.writeFileSync(path.join(root, 'src/app/_layout.tsx'), layoutContent);
    fs.writeFileSync(path.join(root, 'src/app/index.tsx'), indexContent);
    fs.writeFileSync(path.join(root, 'src/screens/second.tsx'), secondScreen);
    fs.writeFileSync(path.join(root, 'src/assets/fonts/fonts.ts'), fontsContent);
    fs.writeFileSync(path.join(root, 'declarations.d.ts'), declarationContent);
    fs.writeFileSync(path.join(root, 'tsconfig.json'), tsconfigContent);
    fs.writeFileSync(path.join(root, 'expo-env.d.ts'), expoEnvContent);
    fs.writeFileSync(path.join(root, '.gitignore'), gitignoreContent);
    const fontSourcePath = path.join(__dirname, 'cli-assets', 'fonts', 'SpaceMono-Regular.ttf');
    const fontDestPath = path.join(root, 'src', 'assets', 'fonts', 'SpaceMono-Regular.ttf');
    fs.copyFileSync(fontSourcePath, fontDestPath);
    
    execSync('npm install --loglevel=error --audit=false', { stdio: 'inherit', cwd: root });

    console.log('\n✅ Projeto configurado com sucesso!');
  });
