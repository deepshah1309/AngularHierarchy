import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';

interface Person {
  id: String;
  name: String;
  age: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [MessageService],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data1: TreeNode[];

  data2: TreeNode[];

  selectedNode: TreeNode;

  constructor(private messageService: MessageService) {}

 
  available: Person[] = [];

  unAvailable: Person[] = [
    { id: '1', name: 'nupur1', age: 24 },
    { id: '2', name: 'sakshi1', age: 21 },
    { id: '3', name: 'Shiva1', age: 22 },
    { id: '4', name: 'Deep1', age: 22 },
    { id: '5', name: 'nupur2', age: 24 },
    { id: '6', name: 'sakshi2', age: 21 },
    { id: '7', name: 'deep2', age: 22 },
    { id: '8', name: 'shiva2', age: 22 },
    { id: '9', name: 'abc', age: 21 },
    {id:'10',name:"DEEP3",age:22},
    {id:"11",name:"Rockstar",age:22},
    {id:"12",name:"Musician",age:22}
  ];
  selected: Person[] = [];
  draggedNodeFromHierarchy: any;
  rawData: any[] = [
    { id: 1, parentId: null, childId: 4 },
    {
      id: 2,
      parentId: 4,
      childId: 6,
    },
    {
      id: 3,
      parentId: 4,
      childId: 5,
    },
    {
      id: 4,
      parentId: 5,
      childId: 7,
    },
    {
      id: 5,
      parentId: 5,
      childId: 8,
    },
    {
      id: 6,
      parentId: 5,
      childId: 9,
    },
    {
      id: 7,
      parentId: 6,
      childId: 10,
    },
    {
      id: 8,
      parentId: 6,
      childId: 11,
    },
    {
      id: 9,
      parentId: 6,
      childId: 12,
    },

  ];
  mapper(arr) {
    if (arr.length == 0) {
      return [];
    }
    return arr.map((v) => this.genTree(v));
  }
  genTree(row) {
    let children = this.rawData.filter((obj) => obj.parentId == row.childId);
    return {
      label: 'xyz',
      data: {
        name: this.unAvailable.filter((obj)=>obj?.id==row.childId)[0]?.name,
        id: row.childId,
      },
      type: 'person',
      expanded: true,
      children: this.mapper(children),
    };
  }

  currentlyDragging: Person | null = null;
  // On Drag Start
  dragStart(person: Person) {
    this.currentlyDragging = person;

    // Show the toast message on the frontend
    this.messageService.add({
      severity: 'info',
      summary: 'Drag Started',
      detail: 'onDragStart Event',
    });
  }

  drag() {
    // Show the toast message on the frontend
    this.messageService.add({
      severity: 'success',
      summary: 'Dragging...',
      detail: 'onDrag Event',
    });
  }

  // On Drag End
  dragEnd() {
    this.currentlyDragging = null;
    // Show the toast message on the frontend
    this.messageService.add({
      severity: 'error',
      summary: 'Drag End',
      detail: 'onDragEnd Event',
    });
  }

  // On Drop of Item to droppable area
  drop(data) {
    console.log(data);
    this.changeAllocation(data, this.currentlyDragging);
    console.log(this.currentlyDragging);
    if (this.currentlyDragging) {
      let currentlyDraggingIndex = this.findIndex(this.currentlyDragging);
      this.selected = [...this.selected, this.currentlyDragging];
      this.available = this.available.filter(
        (val, i) => i != currentlyDraggingIndex
      );
      this.currentlyDragging = null;
    }
  }

  // Find the Index of a Person
  findIndex(person: Person) {
    let index = -1;
    for (let i = 0; i < this.available.length; i++) {
      if (person.id === this.available[i].id) {
        index = i;
        break;
      }
    }
    return index;
  }

  ngOnInit() {
    this.data2 = [this.genTree({ childId: 4 })];

    this.available = [
      {
        id: 'ASDF12',
        name: 'Anshu',
        age: 19,
      },
      {
        id: 'KJHY45',
        name: 'Shikhar',
        age: 22,
      },
      {
        id: 'LKIO34',
        name: 'Jayant',
        age: 32,
      },
      {
        id: 'LPOI21',
        name: 'Krishna',
        age: 23,
      },
      {
        id: 'VANI12',
        name: 'Vanishka',
        age: 20,
      },
    ];
  }
  dragStartForHierarchy(node) {
    this.draggedNodeFromHierarchy = node;
  }
  dropEndHierarchyNodeToDeAllocation() {
    console.log(this.draggedNodeFromHierarchy);
    console.log(this.draggedNodeFromHierarchy);
    console.log('end');

    // let childrenList = this.rawData.filter((obj) => {
    //   return obj?.parentId == this.draggedNodeFromHierarchy?.id;
    // });
    let parent: any[] = this.rawData.filter((obj) => {
      return obj?.childId == this.draggedNodeFromHierarchy?.id;
    });
    let grandParentId = parent[0]?.parentId;
    this.rawData = this.rawData.map((obj) => {
      if (obj.parentId == this.draggedNodeFromHierarchy?.id) {
        obj.parentId = grandParentId;
      }
      return obj;
    });
    this.rawData = this.rawData.filter((obj)=>{
      return obj.childId!=this.draggedNodeFromHierarchy?.id;
    })
    this.data2 = [this.genTree({ childId: 4 })];
    this.available.push({
      id: this.draggedNodeFromHierarchy?.id,
      name: this.draggedNodeFromHierarchy?.name,
      age: 15,
    });
  }
  dragEndForHierarchy() {
   
  }
  changeAllocation(to: any, from: any) {
    //create mapping
    let obj = {
      id: this.rawData.length + 1,
      parentId: to?.id,
      childId: from?.id,
    };
    console.log(obj);
    this.rawData = [...this.rawData, obj];
    this.unAvailable.push({ ...from, age: 12 });
    this.data2 = [this.genTree({ childId: 4 })];
  }

  UnAllocate() {}
  onNodeSelect(event) {
    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Node Selected',
    //   detail: event.node.label,
    // });
  }
}
