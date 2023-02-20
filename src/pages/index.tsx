import {
  Accordion,
  AccordionButton, AccordionIcon,
  AccordionItem, AccordionPanel,
  Button,
  Heading,
  HStack, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger,
  Stack,
  Text
} from "@chakra-ui/react";
import {useRef, useState} from "react";
import Editor from "@monaco-editor/react";

const Home = () => {
  const [text, setText] = useState("");
  const monacoRef = useRef(null);

  const Operator = [
    {
      name: '基础运算符 Basic Operator',
      children: [
        {
          name: '+',
          value: '+',
          explain: '+',
        },
        {
          name: '-',
          value: '-',
          explain: '-',
        },
        {
          name: '*',
          value: '*',
          explain: '*',
        },
        {
          name: '/',
          value: '/',
          explain: '/',
        },
        {
          name: '**',
          value: '**',
          explain: '**',
        }
      ]
    }, {
      name: '内置函数 Built-in Function',
      children: [
        {
          name: 'bn()',
          value: 'bn()',
          explain: 'bn()',
        },
        {
          name: 'ts()',
          value: 'ts()',
          explain: 'ts()',
        },
        {
          name: 'op(int pairIndex)',
          value: 'op(int pairIndex)',
          explain: 'op(int pairIndex)',
        },
        {
          name: 'oav(int pairIndex, int count)',
          value: 'oav(int pairIndex, int count)',
          explain: 'oav(int pairIndex, int count)',
        },
        {
          name: 'ln(int v)',
          value: 'ln(int v)',
          explain: 'ln(int v)',
        },
        {
          name: 'exp(int v)',
          value: 'exp(int v)',
          explain: 'exp(int v)',
        },
        {
          name: 'flo(int v)',
          value: 'flo(int v)',
          explain: 'flo(int v)',
        },
        {
          name: 'cel(int v)',
          value: 'cel(int v)',
          explain: 'cel(int v)',
        },
        {
          name: 'log(int a, int b)',
          value: 'log(int a, int b)',
          explain: 'log(int a, int b)',
        },
        {
          name: 'pow(int a, int b)',
          value: 'pow(int a, int b)',
          explain: 'pow(int a, int b)',
        },
      ]
    }, {
      name: '鞅函数 Martingale Function',
      children: [
        {
          name: 'm1(int pairIndex)',
          value: 'm1(int pairIndex)',
          explain: '线性函数, m1 = a * x + c\n其中，pairIndex表示目标代币编号(0:ETH, 1:NEST, 2:BTC)',
        },
        {
          name: 'm2(int pairIndex)',
          value: 'm2(int pairIndex)',
          explain: '平方函数，m2 = a * x ** 2 + c\n其中，pairIndex表示目标代币编号(0:ETH, 1:NEST, 2:BTC)',
        },
        {
          name: 'm3(int pairIndex)',
          value: 'm3(int pairIndex)',
          explain: '倒数函数，m3 = a / x + c\n其中，pairIndex表示目标代币编号(0:ETH, 1:NEST, 2:BTC)',
        },
        {
          name: 'm4(int pairIndex)',
          value: 'm4(int pairIndex)',
          explain: '开方函数，m4 = a * x ** 0.5 + c\n其中，pairIndex表示目标代币编号(0:ETH, 1:NEST, 2:BTC)',
        },
        {
          name: 'm5(int pairIndex)',
          value: 'm5(int pairIndex)',
          explain: '对数函数，m5 = a * ln(x) + c\n其中，pairIndex表示目标代币编号(0:ETH, 1:NEST, 2:BTC)',
        }
      ],
    }
  ]

  return (
    <Stack p={5} h={'100vh'}>
      <Stack align={"center"}>
        <Heading fontSize={'xl'}>NESTCraft Demo</Heading>
      </Stack>
      <Heading fontSize={'md'}>0xUSER</Heading>
      <HStack h={'full'} spacing={5}>
        <Stack minW={'400px'} bg={'gray.100'} h={'full'} spacing={4} overflow={'scroll'}>
          <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
            {
              Operator.map((item, index) => (
                <AccordionItem key={index}>
                  <AccordionButton>
                    <Text w={'full'} textAlign={"start"} fontSize={'sm'} fontWeight={'semibold'}
                          color={'#003434'}>{item.name}</Text>
                    <AccordionIcon/>
                  </AccordionButton>
                  <AccordionPanel px={4} pb={4}>
                    <Stack spacing={3}>
                      {
                        item.children.map((child, childIndex) => (
                          <Popover key={childIndex} trigger={'hover'}>
                            <PopoverTrigger>
                              <Text fontSize={'sm'} cursor={'pointer'} pl={2}
                                      onClick={() => {
                                        if (monacoRef) {
                                          // @ts-ignore
                                          const selection = monacoRef.current.getSelection();
                                          const id = { major: 1, minor: 1 };
                                          const text = child.value + " ";
                                          const op = {identifier: id, range: selection, text: text, forceMoveMarkers: true};
                                          // @ts-ignore
                                          monacoRef.current.executeEdits("my-source", [op]);
                                        }
                                      }}>
                                {child.name}
                              </Text>
                            </PopoverTrigger>
                            <PopoverContent borderRadius={'0'}>
                              <PopoverHeader fontSize={'sm'} color={'#003232'} fontWeight={'semibold'}>{child.name}</PopoverHeader>
                              <PopoverBody>
                                <Text fontSize={'sm'} color={'#003232'} whiteSpace={'pre-wrap'}>{child.explain}</Text>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        ))
                      }
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              ))
            }
          </Accordion>
        </Stack>
        <Stack w={'full'} h={'full'} spacing={5}>
          <Stack w={'full'} h={'full'} bg={'#1e1e1e'} py={4}>
            <Editor
              theme={'vs-dark'}
              defaultLanguage={"javascript"}
              defaultValue={""}
              onChange={(value) => {
                setText(value || '')
              }}
              onMount={(editor, monaco) => {
                if (monacoRef) {
                  // @ts-ignore
                  monacoRef.current = editor
                }
              }}
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