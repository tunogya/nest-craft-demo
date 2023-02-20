import {Button, Heading, HStack, IconButton, Stack, Text} from "@chakra-ui/react";
import {useState} from "react";
import Editor from "@monaco-editor/react";
import {SmallAddIcon} from "@chakra-ui/icons";

const Home = () => {
  const [text, setText] = useState("");

  return (
    <Stack p={5} h={'100vh'}>
      <Stack align={"center"}>
        <Heading fontSize={'xl'}>NESTCraft Demo</Heading>
      </Stack>
      <Heading fontSize={'md'}>0xUSER</Heading>
      <HStack h={'full'} spacing={5}>
        <Stack minW={'400px'} bg={'gray.100'} h={'full'} p={4} spacing={4}>
          <Stack>
            <Text fontSize={'sm'} fontWeight={'semibold'}>基础运算符</Text>
            <Text fontSize={'sm'}>+</Text>
            <Text fontSize={'sm'}>-</Text>
            <Text fontSize={'sm'}>*</Text>
            <Text fontSize={'sm'}>/</Text>
            <Text fontSize={'sm'}>**</Text>
          </Stack>

          <Stack>
            <Text fontSize={'sm'} fontWeight={'semibold'}>内置函数</Text>
            <Text fontSize={'sm'}>bn()</Text>
            <Text fontSize={'sm'}>ts()</Text>
            <Text fontSize={'sm'}>op(int pairIndex)</Text>
            <Text fontSize={'sm'}>oav(int pairIndex, int count)</Text>
            <Text fontSize={'sm'}>ln(int v)</Text>
            <Text fontSize={'sm'}>exp(int v)</Text>
            <Text fontSize={'sm'}>flo(int v)</Text>
            <Text fontSize={'sm'}>cel(int v)</Text>
            <Text fontSize={'sm'}>log(int a, int b)</Text>
            <Text fontSize={'sm'}>pow(int a, int b)</Text>
          </Stack>

          <Stack>
            <HStack justifyContent={"space-between"}>
              <Text fontSize={'sm'} fontWeight={'semibold'}>自定义函数</Text>
              <IconButton aria-label={'Add'} size={'sm'} icon={<SmallAddIcon/>}/>
            </HStack>
            <Text fontSize={'sm'}>diyFunc1()</Text>
            <Text fontSize={'sm'}>diyFunc2()</Text>
          </Stack>

          <Stack>
            <Text fontSize={'sm'} fontWeight={'semibold'}>鞅函数</Text>
            <Text fontSize={'sm'}>m1(int pairIndex)</Text>
            <Text fontSize={'sm'}>m2(int pairIndex)</Text>
            <Text fontSize={'sm'}>m3(int pairIndex)</Text>
            <Text fontSize={'sm'}>m4(int pairIndex)</Text>
            <Text fontSize={'sm'}>m5(int pairIndex)</Text>
          </Stack>
        </Stack>
        <Stack w={'full'} h={'full'} spacing={5}>
          <Stack w={'full'} h={'full'} bg={'#1e1e1e'} py={4}>
            <Editor
              theme={'vs-dark'}
              defaultLanguage={"javascript"}
              defaultValue={""}
              onChange={(value) => setText(value || '')}
            />
          </Stack>
          <Stack w={'full'} minH={'240px'} bg={'yellow.200'} p={4} align={"center"} justifyContent={"center"}>
            <Text fontSize={'sm'} fontWeight={'semibold'} color={'#003232'}>创建你的 NESTCraft 表达式</Text>
            <Button fontSize={'sm'} fontWeight={'semibold'}>Run</Button>
          </Stack>
        </Stack>
      </HStack>
    </Stack>
  )
}

export default Home