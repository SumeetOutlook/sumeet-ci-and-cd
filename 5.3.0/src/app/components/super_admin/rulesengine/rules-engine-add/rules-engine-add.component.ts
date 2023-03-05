import { Component, OnInit, Injectable } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnotifyToast, SnotifyService, SnotifyPosition } from 'ng-snotify';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { CommonService } from 'app/components/services/CommonService';
import { Router, ActivatedRoute } from "@angular/router";
import { GroupService } from 'app/components/services/GroupService';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';


export interface Type {
  value: string;
  viewValue: string;
}
export class TodoItemNode {
  children: TodoItemNode[];
  type: string;
  fact: string;
  operator: string;
  value: string;
  Currency: string;
  disabled: boolean;
  actiondisabled: boolean;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  type: string;
  fact: string;
  operator: string;
  value: string;
  Currency: string;
  disabled: boolean;
  actiondisabled: boolean;
  level: number;
  expandable: boolean;
}
/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(private cs: CommonService, private router: Router,) {

    //var editData = this.router.getCurrentNavigation().extras.state;
    this.initialize();
  }

  initialize() {

    const TREE_DATA: TodoItemNode[] = [{
      type: 'all',
      fact: 'none',
      operator: '',
      value: '',
      Currency: '',
      disabled: false,
      actiondisabled: false,
      children: []
      // children: [{
      //   type: 'all',
      //   fact: 'all',
      //   operator: '',
      //   value: '',
      //   disabled: false,
      //   actiondisabled : false,
      //   children: [{
      //     type: '',
      //     fact: '',
      //     operator: '',
      //     value: '',
      //     disabled: false,
      //     actiondisabled : false,
      //     children: []
      //   }, {
      //     type: '',
      //     fact: '',
      //     operator: '',
      //     value: '',
      //     disabled: false,
      //     actiondisabled : false,
      //     children: []
      //   }, {
      //     type: '',
      //     fact: '',
      //     operator: '',
      //     value: '',
      //     disabled: false,
      //     actiondisabled : false,
      //     children: []
      //   }]
      // }, 
      // {
      //   type: 'all',
      //   fact: 'all',
      //   operator: '',
      //   value: '',
      //   disabled: false,
      //   actiondisabled : false,
      //   children: []
      // }]
    }];
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    //const data = this.buildFileTree(TREE_DATA, 0);
    // Notify the change.
    this.dataChange.next(TREE_DATA);
  }
  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  // buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
  //    
  //   return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
  //      
  //     const value = obj[key];
  //     const node = new TodoItemNode();
  //     node.item = key;
  //     if (value != null) {
  //       if (typeof value === 'object') {
  //         node.children = this.buildFileTree(value, level + 1);
  //       } else {
  //         node.item = value;
  //       }
  //     }
  //     return accumulator.concat(node);
  //   }, []);
  // }

  /** Add an item to to-do list */
  insertSubItem(parent: TodoItemNode, type: any[]) {

    if (parent.children) {
      // parent.children.push({item: name} as TodoItemNode);
      let model = {
        type: '',
        fact: '',
        operator: '',
        value: '',
        Currency: '',
        types: type,
        disabled: false,
        actiondisabled: false,
        children: []
      } as TodoItemNode;
      //parent.children.push(model);
      parent.children.splice(0, 0, model);
      this.dataChange.next(this.data);
    }
  }
  insertNestedItem(parent: TodoItemNode, fact: string) {

    var type = 'all';
    if (parent.type == 'all') {
      type = 'any';
    }
    if (parent.children) {
      let model = {
        type: type,
        fact: fact,
        operator: '',
        value: '',
        disabled: true,
        actiondisabled: false,
        children: []
      } as TodoItemNode;
      parent.children.push(model);
      //parent.children.splice(0, 0, model);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, model: TodoItemNode) {

    node.type = model.type;
    node.fact = model.fact;
    node.operator = model.operator;
    node.value = model.value;
    this.dataChange.next(this.data);
  }

  deleteItem(parent: TodoItemNode, fact: string, operator: string, value: string) {

    if (parent.children) {
      //parent.children.pop();
      //parent.children = parent.children.filter(c => c.fact !== fact);
      parent.children = parent.children.filter(function (item) {
        if (item.fact == fact && item.operator == operator && item.value == value) { return false; }
        else { return true; }
      })
      this.dataChange.next(this.data);
    }
  }
}


@Component({
  selector: 'app-rules-engine-add',
  templateUrl: './rules-engine-add.component.html',
  styleUrls: ['./rules-engine-add.component.css'],
  providers: [ChecklistDatabase]
})

export class RulesEngineAddComponent implements OnInit {
  selectedValue: any;
  selectedOperator: any;
  selectedOptionOne: any;
  selectedOptionTwo: any;
  selectedCategory: any;
  selectedRelType: any;
  selectedRSubType: any;
  selectedParty: any;
  selectedTxnType: any;
  selectedTxnSubType: any;
  selectedTxnName: any;
  public currencyData: any[] = [];
  CurrencyFilter: FormControl;

  checkedAudit: boolean = false;
  checkedBoard: boolean = false;
  checkedShareholder: boolean = false;

  Types: Type[] = [
    { value: 'all', viewValue: 'All' },
    { value: 'any', viewValue: 'Any' },
  ];


  actionApprovalTypes: Type[] = [
    { value: 'Skip Transfer approval 3', viewValue: 'Skip Transfer approval 3' },
    { value: 'skip Transfer approval 2 and 3', viewValue: 'skip Transfer approval 2 and 3' },
    { value: 'skip Transfer approval 1,2 & 3', viewValue: 'skip Transfer approval 1,2 and 3' },
    { value: 'Skip Retirment approval 3', viewValue: 'Skip Retirment approval 3' },
    { value: 'skip Retirment approval 2 and 3', viewValue: 'skip Retirment approval 2 and 3' },
    { value: 'skip Retirment approval 1,2 and 3', viewValue: 'skip Retirment approval 1,2 and 3' },

  ];

  operatorTypes: Type[] = [
    { value: 'equal', viewValue: 'equal' },
    { value: 'notEqual', viewValue: 'not Equal' },
    { value: 'in', viewValue: 'in' },
    { value: 'notIn', viewValue: 'notIn' },
    { value: 'lessThan', viewValue: 'less Than' },
    { value: 'lessThanInclusive', viewValue: 'less Than Inclusive' },
    { value: 'greaterThan', viewValue: 'greater Than' },
    { value: 'greaterThanInclusive', viewValue: 'greater Than Inclusive' }
  ];
  operator1Types: Type[] = [
    { value: 'Equal to', viewValue: 'Equal to' },
    { value: 'NotEqual to', viewValue: 'Not Equal to' },
    { value: 'LessThan', viewValue: 'Less Than' },
    { value: 'GreaterThan', viewValue: 'Greater Than' },
  ];
  operator2Types: Type[] = [
    { value: 'Equal to', viewValue: 'Equal to' },
    { value: 'NotEqual to', viewValue: 'Not Equal to' },
    { value: 'Includes', viewValue: 'Includes' },
    { value: ' NotIncludes', viewValue: 'Not Includes' },
  ];
  // operatorTypes: Type[] = [
  //   { value: 'equal', viewValue: 'Equals' },
  //   { value: 'lessThan', viewValue: 'Less Than' },
  //   { value: 'lessThanInclusive', viewValue: 'Equal to or Less than' },
  //   { value: 'greaterThan', viewValue: 'Greater Than' },
  //   { value: 'greaterThanInclusive', viewValue: 'Equal to or Greater Than' }
  // { value: 'notEqual', viewValue: 'not Equal' },
  // { value: 'in', viewValue: 'in' },
  // { value: 'notIn', viewValue: 'notIn' },
  // ];
  // operatorTypes1: Type[] = [
  //   { value: 'equal', viewValue: 'Equals' }
  // ];

  approvalTypes: Type[] = [
    { value: 'createtransaction', viewValue: 'Create Transaction' },
    { value: 'sendforapproval', viewValue: 'Send For Approval' },
  ];

  ALPTypes: Type[] = [
    { value: 'Yes', viewValue: 'Yes' },
    { value: 'No', viewValue: 'No' },
  ];
  OCBTypes: Type[] = [
    { value: 'Yes', viewValue: 'Yes' },
    { value: 'No', viewValue: 'No' },
  ];

  // optionOneTypes: Type[] = [
  //   { value: 'Relationship Category', viewValue: 'Relationship Category' , disabled:false},
  //   { value: 'Relationship Type', viewValue: 'Relationship Type' , disabled:false},
  //   { value: 'Relationship SubType', viewValue: 'Relationship SubType' , disabled:false},
  //   { value: 'Related Party', viewValue: 'Related Party' , disabled:false},
  //   { value: 'Transaction Category', viewValue: 'Transaction Category' , disabled:false},
  //   { value: 'Transaction Type', viewValue: 'Transaction Type' , disabled:false},
  //   { value: 'Transaction SubType', viewValue: 'Transaction SubType' , disabled:false},
  //   { value: 'Transaction Name', viewValue: 'Transaction Name' , disabled:false},
  //   { value: 'ALP', viewValue: 'ALP' , disabled:false},
  //   { value: 'OCB', viewValue: 'OCB' , disabled:false},
  //   { value: 'Threshold % - Txn Amount', viewValue: 'Threshold % - Txn Amount' , disabled:false},
  //   { value: 'Threshold Value - Revenue', viewValue: 'Threshold Value - Revenue' , disabled:false},
  // ];
  optionOneTypes: Type[] = [
    { value: 'Cost', viewValue: 'Cost' },
    { value: 'Wdv', viewValue: 'Wdv' },
    { value: 'Class', viewValue: 'Class' },
    { value: 'Quantity', viewValue: 'Quantity' },
    { value: 'Asset Type', viewValue: 'Asset Type' },
    { value: 'Asset SubType', viewValue: 'Asset SubType' },
    { value: 'Location', viewValue: 'Location' },
    { value: 'Asset Name', viewValue: 'Asset Name' },  //  (adl2)
    { value: 'Asset Description', viewValue: 'Asset Description' },
    // { value: 'Relationship Category', viewValue: 'Relationship Category' },
    // { value: 'Relationship Type', viewValue: 'Relationship Type' },
    // { value: 'Relationship SubType', viewValue: 'Relationship SubType' },
    // { value: 'Related Party', viewValue: 'Related Party' },
    // { value: 'Transaction Category', viewValue: 'Transaction Category' },
    // { value: 'Transaction Type', viewValue: 'Transaction Type' },
    // { value: 'Transaction SubType', viewValue: 'Transaction SubType' },
    // { value: 'Transaction Name', viewValue: 'Transaction Name' },
    // { value: 'ALP', viewValue: 'ALP' },
    // { value: 'OCB', viewValue: 'OCB' },
    // { value: 'audit committee is available', viewValue: 'audit committee is available' },
    // { value: 'SEBI LODR is applicable', viewValue: 'SEBI LODR is applicable' },
    // { value: 'Transaction Amount', viewValue: 'Transaction Amount' },
    // { value: 'Cumulative Transaction Amount', viewValue: 'Cumulative Transaction Amount' },
  ];

  thresholdTypes: Type[] = [
    { value: '10% of Standalone Turnover', viewValue: '10% of Standalone Turnover' },
    { value: '10% of Consolidated Turnover', viewValue: '10% of Consolidated Turnover' },
    { value: '10% of Assets', viewValue: '10% of Assets' },
    { value: '10% of Networth', viewValue: '10% of Networth' },
    { value: '10% of Omnibus Approval Limit', viewValue: '10% of Omnibus Approval Limit' }
  ];

  tempOptionOneTypes: Type[] = [];
  relationshipGroups: Type[] = [];
  categoryTypes: Type[] = [];
  relationshipTypes: Type[] = [];
  relationshipSubTypes: Type[] = [];
  relpartyTypes: Type[] = [];
  transactionTypes: Type[] = [];
  transactionCategoryTypes: Type[] = [];
  transactionSubTypes: Type[] = [];
  transactionNameTypes: Type[] = [];
  rulesengineForm: FormGroup;
  ApprovalForm: FormGroup;
  actionsTypes: Type[] = [];
  selectedActions: Type[] = [];
  ruleLists: any[] = [];
  ruleAlredyExist: any = '';
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;
  /** The new item's name */
  newItemName = '';
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  protected _onDestroy = new Subject<void>();
  public filteredCurrency: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public Currency1: FormControl = new FormControl();
  // public CurrencyFilter: FormControl = new FormControl();

  constructor(
    private database: ChecklistDatabase,
    private cs: CommonService,
    private router: Router,
    private storage: ManagerService,
    public groupservice: GroupService,) {


    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }
  submitted: boolean = false;
  get f() { return this.rulesengineForm.controls; };
  get f1() { return this.ApprovalForm.controls; };
  ngOnInit() {

    // this.cs.relGroupGetData().subscribe(r => {
    //   this.relationshipGroups = r.data
    // })
    // this.cs.relCategoryGetData().subscribe(r => {
    //   this.categoryTypes = r.data
    // })
    // this.cs.relTypeGetData().subscribe(r => {
    //   this.relationshipTypes = r.data
    // })
    // this.cs.relSubTypeGetData().subscribe(r => {
    //   this.relationshipSubTypes = r.data
    // })
    // this.cs.relatedPartiesGetData("data").subscribe(r => {
    //   this.relpartyTypes = r.data
    // })
    // this.cs.transactionCategoryGetData().subscribe(r => {
    //   this.transactionCategoryTypes = r.data
    // })
    // this.cs.transactionTypeGetData().subscribe(r => {
    //   this.transactionTypes = r.data
    // })
    // this.cs.transactionSubTypeGetData().subscribe(r => {
    //   this.transactionSubTypes = r.data
    // })
    // this.cs.transactionNamesGetDta().subscribe(r => {
    //   this.transactionNameTypes = r.data
    // })
    // this.cs.actionsListGetData().subscribe(r => {
    //   
    //   r.data.forEach(element => {
    //     element.value = "All";
    //     this.actionsTypes.push(element)
    //   })      
    // })
    // this.cs.rulesListGetData().subscribe(r =>{
    //   this.ruleLists = r.data
    // })
    this.GetAllCurrency();
    this.Currency1.setValue(this.currencyData);

    this.rulesengineForm = new FormGroup({
      ruleName: new FormControl('', [Validators.required]),
      approval: new FormControl('', [Validators.required]),
      // CurrencyFilter: new FormControl(''),
      //copyRule: new FormControl('')
    })
  }
  getLevel = (node: TodoItemFlatNode) => node.level;
  isExpandable = (node: TodoItemFlatNode) => node.expandable;
  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.fact === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {

    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.fact === node.fact
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.type = node.type;

    flatNode.fact = node.fact;
    flatNode.operator = node.operator;
    flatNode.value = node.value;
    flatNode.Currency = node.Currency;
    flatNode.disabled = node.disabled;
    flatNode.actiondisabled = node.actiondisabled;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    this.treeControl.expand(flatNode)
    return flatNode;
  }
  onchangeRules() {

    var rulename = this.rulesengineForm.get('ruleName').value;
    this.ruleAlredyExist = '';
    var arr = [];
    arr = this.ruleLists.filter((item) => item.name === rulename);
    if (arr.length > 0) {
      this.ruleAlredyExist = "Rule Name ''" + rulename + "'' Alredy Exist";
      this.rulesengineForm.get('ruleName').setValue('');
    }
  }

  onChangeRelation(fact, type) {

    if (fact == 'Relationship Category') {
      this.relationshipTypes = [];
      this.relationshipSubTypes = [];
      this.relpartyTypes = [];
      this.cs.relTypeGetData().subscribe(r => {
        r.data.forEach(element => {
          if (this.trim(element.relationshipCategory) == this.trim(type.relationshipCategory)) {
            this.relationshipTypes.push(element);
          }
        })
      })
      this.cs.relSubTypeGetData().subscribe(r => {
        r.data.forEach(element => {
          if (this.trim(element.relationshipCategory) == this.trim(type.relationshipCategory)) {
            this.relationshipSubTypes.push(element);
          }
        })
      })
      this.cs.relatedPartiesGetData("data").subscribe(r => {
        r.data.forEach(element => {
          if (this.trim(element.relationshipCategory) == this.trim(type.relationshipCategory)) {
            this.relpartyTypes.push(element);
          }
        })
      })
    }
    if (fact == 'Relationship Type') {
      this.relationshipSubTypes = [];
      this.relpartyTypes = [];
      this.cs.relSubTypeGetData().subscribe(r => {
        r.data.forEach(element => {

          if (this.trim(element.relationshipCategory) == this.trim(type.relationshipCategory) && this.trim(element.relationshipType) == this.trim(type.relationshipType)) {

            this.relationshipSubTypes.push(element);
          }
        })
      })
      this.cs.relatedPartiesGetData("data").subscribe(r => {
        r.data.forEach(element => {

          if (this.trim(element.relationshipCategory) == this.trim(type.relationshipCategory) && this.trim(element.relationshipType) == this.trim(type.relationshipType)) {

            this.relpartyTypes.push(element);
          }
        })
      })
    }
    if (fact == 'Relationship SubType') {
      this.relpartyTypes = [];
      this.cs.relatedPartiesGetData("data").subscribe(r => {
        r.data.forEach(element => {

          if (this.trim(element.relationshipCategory) == this.trim(type.relationshipCategory) && this.trim(element.relationshipType) == this.trim(type.relationshipType) && this.trim(element.relationshipSubType) == this.trim(type.relationshipSubType)) {

            this.relpartyTypes.push(element);
          }
        })
      })
    }
  }
  onChangeTransaction(fact, type) {

    if (fact == 'Transaction Category') {
      this.transactionTypes = [];
      this.transactionSubTypes = [];
      this.transactionNameTypes = [];
      this.cs.transactionTypeGetData().subscribe(r => {
        r.data.forEach(element => {
          if (element.transactionCategory == type.transactionCategory) {
            this.transactionTypes.push(element);
          }
        })
      })
      this.cs.transactionSubTypeGetData().subscribe(r => {
        r.data.forEach(element => {
          if (element.transactionCategory == type.transactionCategory) {
            this.transactionSubTypes.push(element);
          }
        })
      })
      this.cs.transactionNamesGetDta().subscribe(r => {
        r.data.forEach(element => {
          if (element.transactionCategory == type.transactionCategory) {
            this.transactionNameTypes.push(element);
          }
        })
      })
    }
    if (fact == 'Transaction Type') {
      this.transactionSubTypes = [];
      this.transactionNameTypes = [];
      this.cs.transactionSubTypeGetData().subscribe(r => {
        r.data.forEach(element => {
          if (element.transactionCategory == type.transactionCategory && element.transactionType == type.transactionType) {
            this.transactionSubTypes.push(element);
          }
        })
      })
      this.cs.transactionNamesGetDta().subscribe(r => {
        r.data.forEach(element => {
          if (element.transactionCategory == type.transactionCategory && element.transactionType == type.transactionType) {
            this.transactionNameTypes.push(element);
          }
        })
      })
    }
    if (fact == 'Transaction SubType') {
      this.transactionNameTypes = [];
      this.cs.transactionNamesGetDta().subscribe(r => {
        r.data.forEach(element => {
          if (element.transactionCategory == type.transactionCategory && element.transactionType == type.transactionType && element.transactionSubType == type.transactionSubType) {
            this.transactionNameTypes.push(element);
          }
        })
      })
    }
  }
  trim(str) {
    //return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    return str;
  }
  /** Select the category so we can insert the new item. */
  addSubNode(node: TodoItemFlatNode) {

    var lth = this.treeControl.dataNodes.length;
    const parentNode = this.flatNodeMap.get(node);
    if (!parentNode.children) {
      parentNode.children = [];
    }
    if (node.fact == 'none') {
      this.database.insertNestedItem(parentNode!, lth.toString());
    }
    else {
      this.tempOptionOneTypes = [];
      this.bindTypesData(parentNode);

      this.database.insertSubItem(parentNode!, this.tempOptionOneTypes);
    }
    this.treeControl.expand(node);
  }

  bindTypesData(parent: TodoItemNode) {

    let other = [];
    if (parent.children.length > 0) {
      parent.children.forEach(item => other.push(item.fact));

      if (other.length > 0) {
        this.optionOneTypes.forEach(function (item) {

          const index: number = other.indexOf(item.value);
          if (index > -1) {
            // const idx: number = this.tempOptionOneTypes.indexOf(item);
            // if(index > -1 ) { 
            //   this.tempOptionOneTypes.splice(idx , 1 ); 
            // }        
            //item.disabled = true;    
          }
          else {
            //item.disabled = false;
          }
        });
      }
      this.optionOneTypes.forEach(item => this.tempOptionOneTypes.push(item));
    }
    else {
      this.optionOneTypes.forEach(item => this.tempOptionOneTypes.push(item));
    }
  }
  addNestedNode(node: TodoItemFlatNode) {

    var lth = this.treeControl.dataNodes.length;
    const parentNode = this.flatNodeMap.get(node);
    if (!parentNode.children) {
      parentNode.children = [];
    }
    this.database.insertNestedItem(parentNode!, lth.toString());
    this.treeControl.expand(node);
  }
  addNewNode(node: TodoItemFlatNode) {

    let model = {} as TodoItemNode;
    model.type = '';
    model.fact = '';
    model.operator = '';
    model.value = '';
    node.Currency = '';
    model.children = [];
    this.dataSource.data.push(model);
    this.database.dataChange.next(this.dataSource.data);
    //this.treeControl.expand(node);
  }
  doSomething(node: TodoItemFlatNode) {


    var lth = this.treeControl.dataNodes.length;
    const nestedNode = this.flatNodeMap.get(node);
    if (!node.value && node.type != 'all' && node.type != 'any') {
      return false;
    }
    if (node.fact == 'EffectiveFrom' || node.fact == 'EffectiveTo') {
      node.value = new Date(node.value).toISOString().slice(0, 19).replace('T', ' ')

    }
    nestedNode.type = node.type;
    nestedNode.fact = node.fact;
    nestedNode.operator = node.operator;
    nestedNode.value = node.value;
    nestedNode.Currency = node.Currency;
    const nestedNode1 = this.nestedNodeMap.get(nestedNode);
    nestedNode1.fact = '';
    this.database.dataChange.next(this.dataSource.data);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode) {

    var lth = this.treeControl.dataNodes.length;
    const nestedNode = this.flatNodeMap.get(node);
    if (!node.value) {
      return false;
    }
    nestedNode.type = node.type;
    nestedNode.fact = node.fact;
    nestedNode.operator = node.operator;
    nestedNode.value = node.value;
    nestedNode.Currency = node.Currency

    const nestedNode1 = this.nestedNodeMap.get(nestedNode);
    nestedNode1.fact = '';
    this.database.dataChange.next(this.dataSource.data);

  }

  removeNode(node: TodoItemFlatNode) {

    const parentNode = this.getParentNode(node);
    const parentFlat = this.flatNodeMap.get(parentNode);
    this.database.deleteItem(parentFlat!, node.fact, node.operator, node.value);
    this.treeControl.expand(node);
  }
  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {

    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getNestedChildren(arr) {
    var out = []
    for (var i in arr) {
      if (arr[i].children.length > 0) {

        var children = this.getNestedChildren(arr[i].children)

        var a1 = [];
        if (children.length) {
          arr[i].children = children
        }
        var c = [];
        if (arr[i].type == 'all' || arr[i].type == 'any') {
          console.log(arr[i].type);
          for (var j = 0; j < arr[i].children.length; j++) {
            if (!!arr[i].children[j].fact) {
              var d = {
                fact: arr[i].children[j].fact,
                operator: arr[i].children[j].operator,
                value: arr[i].children[j].value,
                Currency: arr[i].children[j].Currency,
              }
              c.push(d)
            }
            else {
              c.push(arr[i].children[j])
            }
          }
        }

        //out.push(arr[i])
        var a;
        if (arr[i].type == 'all') {
          a = { all: c }
        }
        if (arr[i].type == 'any') {
          a = { any: c }
        }
        out.push(a);
      }
      else {
        out.push(arr[i])
      }
    }
    return out
  }
  changeValue(d) {

    let idx = this.selectedActions.indexOf(d.id)
    if (idx > -1) {
      this.selectedActions.splice(idx, 1);
    }
    else {
      this.selectedActions.push(d.id);
    }
    // if (event == '1') { this.checkedAudit = !value; }
    // if (event == '2') { this.checkedBoard = !value; }
    // if (event == '3') { this.checkedShareholder = !value; }
  }
  GetAllCurrency() {

    this.groupservice.GetAllCurrencyData().subscribe(response => {

      this.currencyData = response;
      this.getFilterCurrency();
    })
  }


  getFilterCurrency() {


    this.filteredCurrency.next(this.currencyData.slice());
    this.Currency1.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {

        this.filterCurrencyData();
      });

  }

  protected filterCurrencyData() {

    if (!this.currencyData) {
      return;
    }
    // get the search keyword
    let search = this.Currency1.value;
    if (!search) {
      this.filteredCurrency.next(this.currencyData.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the banks
    this.filteredCurrency.next(
      this.currencyData.filter(x => x.Currency.toLowerCase().indexOf(search) > -1)
    );

    console.log(this.filteredCurrency);
  }

  onSubmit() {

    var JsonData = this.getNestedChildren(this.dataSource.data);
    var data = {
      "name": this.rulesengineForm.get('ruleName').value,
      "type": 'CUSTOM',
      "Action": this.rulesengineForm.get('approval').value,
      "created_by": 2,
      "rule": JSON.stringify(JsonData)
    }

    this.cs.IFruleEngineInsert(data).subscribe(r => {

      this.router.navigateByUrl('/superadmin/rules-engine-list');
    });

    // if (this.selectedActions.length > 0) {
    //   var JsonData = this.getNestedChildren(this.dataSource.data);
    //   var data = {
    //     "name": this.rulesengineForm.get('ruleName').value,
    //     "type": 'CUSTOM',
    //     "actions": this.selectedActions.join(','),
    //     "created_by": this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_NAME),
    //     "rule": JSON.stringify(JsonData)
    //   }

    //   this.cs.rulesInsert(data).subscribe(r => {
    //     
    //     console.log("created transaction", r)
    //     this.router.navigateByUrl('/superadmin/rulesenginelist');
    //   })
    // }
  }

  onBack() {
    this.router.navigateByUrl('/superadmin/rules-engine-list');
  }

}

