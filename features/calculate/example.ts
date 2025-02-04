import Mexp from "math-expression-evaluator";

let flow = {
   "nodes":[
      {
         "id":"ece10ded-8e06-4c12-bf3a-68cf987b4164",
         "type":"ObjectNode",
         "data":{
            "data":{
               "type":{
                  "id":"678674418d3fa3141db4480a",
                  "name":"Lens",
                  "picture":"http://localhost:9000/type/lens.png",
                  "variables":[
                     {
                        "id":"",
                        "name":"Focal Length",
                        "symbol":"f"
                     }
                  ],
                  "input":1,
                  "output":1
               },
               "object":{
                  "name":"Lens",
                  "vars":[
                     {
                        "id":"",
                        "name":"Focal Length",
                        "symbol":"f",
                        "value":"0"
                     }
                  ]
               },
               "output":[
                  {
                     "handleId":"0",
                     "param":[
                        {
                           "id":"1",
                           "name":"beam radius",
                           "symbol":"r",
                           "value":"0"
                        },
                        {
                           "id":"2",
                           "name":"beam angles",
                           "symbol":"θ",
                           "value":"0"
                        }
                     ]
                  }
               ]
            },
            "inputs":{
               "0":""
            }
         },
         "position":{
            "x":37.50000000000004,
            "y":30
         },
         "measured":{
            "width":86,
            "height":110
         },
         "selected":false,
         "dragging":false
      },
      {
         "id":"68d59714-ee65-4e03-9dc8-03c11b6250e4",
         "type":"ObjectNode",
         "data":{
            "data":{
               "type":{
                  "id":"6789260ee6c4ad0d7ad606d5",
                  "name":"Beam splitter",
                  "picture":"http://localhost:9000/type/beamsplitter.png",
                  "variables":[
                     {
                        "id":"",
                        "name":"Split ratio",
                        "symbol":"r"
                     }
                  ],
                  "input":1,
                  "output":2
               },
               "object":{
                  "name":"Beam splitter",
                  "vars":[
                     {
                        "id":"",
                        "name":"Split ratio",
                        "symbol":"r",
                        "value":"0"
                     }
                  ]
               },
               "output":[
                  {
                     "handleId":"0",
                     "param":[
                        {
                           "id":"1",
                           "name":"beam radius",
                           "symbol":"r",
                           "value":"0"
                        },
                        {
                           "id":"2",
                           "name":"beam angles",
                           "symbol":"θ",
                           "value":"0"
                        }
                     ]
                  },
                  {
                     "handleId":"1",
                     "param":[
                        {
                           "id":"1",
                           "name":"beam radius",
                           "symbol":"r",
                           "value":"0"
                        },
                        {
                           "id":"2",
                           "name":"beam angles",
                           "symbol":"θ",
                           "value":"0"
                        }
                     ]
                  }
               ]
            },
            "inputs":{
               "0":""
            }
         },
         "position":{
            "x":343.7499999999999,
            "y":206.25
         },
         "measured":{
            "width":140,
            "height":110
         },
         "selected":false,
         "dragging":false
      },
      {
         "id":"ce793719-46f0-46ff-bb35-ffc464ac2e63",
         "type":"ObjectNode",
         "data":{
            "data":{
               "type":{
                  "id":"6789905f73e67a1a02ee680c",
                  "name":"Half-wave plate",
                  "picture":"http://localhost:9000/type/Half-wave%20plate.png",
                  "variables":[
                     {
                        "id":"",
                        "name":"angle of fast axis",
                        "symbol":"θ"
                     }
                  ],
                  "input":1,
                  "output":1
               },
               "object":{
                  "name":"Half-wave plate",
                  "vars":[
                     {
                        "id":"",
                        "name":"angle of fast axis",
                        "symbol":"θ",
                        "value":"0"
                     }
                  ]
               },
               "output":[
                  {
                     "handleId":"0",
                     "param":[
                        {
                           "id":"1",
                           "name":"beam radius",
                           "symbol":"r",
                           "value":"0"
                        },
                        {
                           "id":"2",
                           "name":"beam angles",
                           "symbol":"θ",
                           "value":"0"
                        }
                     ]
                  }
               ]
            }
         },
         "position":{
            "x":324.9999999999999,
            "y":427.5
         },
         "measured":{
            "width":160,
            "height":110
         },
         "selected":false,
         "dragging":false
      },
      {
         "id":"4e0628bb-4bc2-4a59-ba9a-0b338fe27e33",
         "type":"ObjectNode",
         "data":{
            "data":{
               "type":{
                  "id":"678674418d3fa3141db4480a",
                  "name":"Lens",
                  "picture":"http://localhost:9000/type/lens.png",
                  "variables":[
                     {
                        "id":"",
                        "name":"Focal Length",
                        "symbol":"f"
                     }
                  ],
                  "input":1,
                  "output":1
               },
               "object":{
                  "name":"Lens",
                  "vars":[
                     {
                        "id":"",
                        "name":"Focal Length",
                        "symbol":"f",
                        "value":"0"
                     }
                  ]
               },
               "output":[
                  {
                     "handleId":"0",
                     "param":[
                        {
                           "id":"1",
                           "name":"beam radius",
                           "symbol":"r",
                           "value":"0"
                        },
                        {
                           "id":"2",
                           "name":"beam angles",
                           "symbol":"θ",
                           "value":"0"
                        }
                     ]
                  }
               ]
            }
         },
         "position":{
            "x":-112.5,
            "y":-107.5
         },
         "measured":{
            "width":86,
            "height":110
         },
         "selected":false,
         "dragging":false
      },
      {
         "id":"793b3499-6b6e-4637-bcfb-d3d59a9ec206",
         "type":"ObjectNode",
         "data":{
            "data":{
               "type":{
                  "id":"678674418d3fa3141db4480a",
                  "name":"Lens",
                  "picture":"http://localhost:9000/type/lens.png",
                  "variables":[
                     {
                        "id":"",
                        "name":"Focal Length",
                        "symbol":"f"
                     }
                  ],
                  "input":1,
                  "output":1
               },
               "object":{
                  "name":"Lens",
                  "vars":[
                     {
                        "id":"",
                        "name":"Focal Length",
                        "symbol":"f",
                        "value":"0"
                     }
                  ]
               },
               "output":[
                  {
                     "handleId":"0",
                     "param":[
                        {
                           "id":"1",
                           "name":"beam radius",
                           "symbol":"r",
                           "value":"0"
                        },
                        {
                           "id":"2",
                           "name":"beam angles",
                           "symbol":"θ",
                           "value":"0"
                        }
                     ]
                  }
               ]
            },
            "inputs":{
               "0":""
            }
         },
         "position":{
            "x":193.75000000000003,
            "y":110
         },
         "measured":{
            "width":86,
            "height":110
         },
         "selected":false,
         "dragging":false
      }
   ],
   "edges":[
      {
         "source":"4e0628bb-4bc2-4a59-ba9a-0b338fe27e33",
         "sourceHandle":"source-handle-0",
         "target":"ece10ded-8e06-4c12-bf3a-68cf987b4164",
         "targetHandle":"0",
         "animated":true,
         "id":"2af5174d-b051-4df3-9de9-d1cbb89b0cbd",
         "data":{
            "data":{
               "light":{
                  "distance":"25",
                  "focusDistance":0,
                  "locked":false
               }
            }
         }
      },
      {
         "source":"ece10ded-8e06-4c12-bf3a-68cf987b4164",
         "sourceHandle":"source-handle-0",
         "target":"793b3499-6b6e-4637-bcfb-d3d59a9ec206",
         "targetHandle":"0",
         "animated":true,
         "id":"ac87cfa8-d5c4-4019-8d7f-a8761666f712",
         "data":{
            "data":{
               "light":{
                  "distance":"25",
                  "focusDistance":0,
                  "locked":false
               }
            }
         }
      },
      {
         "source":"793b3499-6b6e-4637-bcfb-d3d59a9ec206",
         "sourceHandle":"source-handle-0",
         "target":"68d59714-ee65-4e03-9dc8-03c11b6250e4",
         "targetHandle":"0",
         "animated":true,
         "id":"3e8949c7-f934-4959-89a4-0bb962387c16",
         "data":{
            "data":{
               "light":{
                  "distance":"30",
                  "focusDistance":0,
                  "locked":false
               }
            }
         },
         "selected":true
      }
   ]
}

// let Configuration = {
//     parameters: ["r","θ"],
//     equations: {
//       "678674418d3fa3141db4480a":{
//          "r":"r",
//          "θ":"((-1)*r/f) + θ"
//       }
//     },
//     freespace: {
//         "r": "r+θ",
//         "θ": "θ"
//     }
// }


// let g: Graph = {
//     nodes: [
//         {"id":"start"},
//         {"id":"ece10ded-8e06-4c12-bf3a-68cf987b4164"},
//         {"id":"68d59714-ee65-4e03-9dc8-03c11b6250e4"},
//         {"id":"ce793719-46f0-46ff-bb35-ffc464ac2e63"},
//         {"id":"4e0628bb-4bc2-4a59-ba9a-0b338fe27e33"},
//         {"id":"793b3499-6b6e-4637-bcfb-d3d59a9ec206"},
//         {"id":"end"}
//     ],
//     edges: [
//         {"source":"start","target":"4e0628bb-4bc2-4a59-ba9a-0b338fe27e33"},
//         {"source":"4e0628bb-4bc2-4a59-ba9a-0b338fe27e33","target":"ece10ded-8e06-4c12-bf3a-68cf987b4164"},
//         {"source":"ece10ded-8e06-4c12-bf3a-68cf987b4164","target":"793b3499-6b6e-4637-bcfb-d3d59a9ec206"},
//         {"source":"793b3499-6b6e-4637-bcfb-d3d59a9ec206","target":"68d59714-ee65-4e03-9dc8-03c11b6250e4"},
//         {"source":"68d59714-ee65-4e03-9dc8-03c11b6250e4","target":"end"}
//     ]
// }



// let data2 ={
//       "nodes":[
//          {
//             "id":"start",
//             "type":"StartNode",
//             "data":{
//                "data":{
//                   "type":"Start"
//                }
//             },
//             "output":{
//                "r" : "10",
//                "θ" : "1.2"
//             }
//          },
//          {
//             "id":"4e0628bb-4bc2-4a59-ba9a-0b338fe27e33",
//             "type":"ObjectNode",
//             "data":{
//                "data":{
//                   "type":{
//                      "id":"678674418d3fa3141db4480a",
//                      "name":"Lens",
//                      "picture":"http://localhost:9000/type/lens.png",
//                      "variables":[
//                         {
//                            "id":"",
//                            "name":"Focal Length",
//                            "symbol":"f"
//                         }
//                      ],
//                      "input":1,
//                      "output":1
//                   },
//                   "object":{
//                      "name":"Lens",
//                      "vars":[
//                         {
//                            "id":"",
//                            "name":"Focal Length",
//                            "symbol":"f",
//                            "value":"15"
//                         }
//                      ]
//                   },
//                   "output":{
//                      "r" : "0",
//                      "θ" : "0"
//                   }
//                }
//             }
//          },
//          {
//             "id":"end",
//             "type":"EndNode",
//             "data":{
//                "data":{
//                   "type":"End"
//                }
//             },
//             "output":{
//                "r" : "0",
//                "θ" : "0"
//             }
//          }
//       ],
//       "edges":[
//          {
//             "source":"start",
//             "id":"2af5174d-b051-4df3-9de9-d1cbb89b0cbd",
//             "data":{
//                "data":{
//                   "light":{
//                      "distance":"25",
//                      "focusDistance":0,
//                      "locked":false
//                   }
//                }
//             }
//          },
//          {
//             "source":"4e0628bb-4bc2-4a59-ba9a-0b338fe27e33",
//             "id":"ac87cfa8-d5c4-4019-8d7f-a8761666f712",
//             "data":{
//                "data":{
//                   "light":{
//                      "distance":"25",
//                      "focusDistance":0,
//                      "locked":false
//                   }
//                }
//             }
//          }
//       ]
// }





