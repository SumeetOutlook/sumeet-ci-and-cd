import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
    //relationshipCategoryUpdatedata: any;
  constructor(private http: HttpClient) { }
 
  insertUserManagementDetails(jsonbody: any) {
    return this.http.post(APIConstants.USERROLESMANAGEMENT,jsonbody)
  }
  configInsertData(data) :Observable<any> {    
    return this.http.post(APIConstants.CONFIGINSERTDATA,data)
  }
  configurationGetdata():Observable<any> {
    return this.http.get(APIConstants.CONFIGURATIONGETDATA)
  }
  configUpdate(data) :Observable<any>{
     return this.http.post(APIConstants.CONFIGURATIONEDIT,data)

  }
  ssoGet() : Observable<any>{
    return this.http.get(APIConstants.SSOGET)
  }
  configurationGetById(id):Observable<any> {
    let params = new HttpParams();
    params = params.append('name', id);
    return this.http.get(APIConstants.CONFIGURATIONGETBYID, {params: params})
  }
  meetGetData() :Observable<any>{
    return this.http.get(APIConstants.MEETGETDATA)
  }
  meetInsertData(data) :Observable<any>{
    return this.http.post(APIConstants.MEETINSERT,data)
  }
  sbuGetData() :Observable<any> {
    return this.http.get(APIConstants.SBUGETDATA)
  }
  sbuInsertData(sbu) :Observable<any> {
    console.log('sbu created service',sbu)
    return this.http.post(APIConstants.SBUINSERT,sbu)
  }
  sbuUpdateData(sbu) :Observable<any> {
    console.log('sbu update service',sbu)
    return this.http.post(APIConstants.SBUEDIT,sbu)
  }
  sbuUploadData(sbu) :Observable<any> {
    return this.http.post(APIConstants.SBUUPLOAD,sbu)
  }
  locationGetData() :Observable<any> {
    return this.http.get(APIConstants.LOCATIONGETDATA)
  }
  locationInsertData(location) :Observable<any> {
    console.log('location created service',location)
    return this.http.post(APIConstants.LOCATIONINSERT,location)
  }
  locationUpdatetData(location) :Observable<any> {
    // console.log('location created service',location)
    return this.http.post(APIConstants.LOCATIONEDIT,location)
  }
  

  costGetData() :Observable<any> {
    return this.http.get(APIConstants.COSTGETDATA)
  }
  costInsertData(cost) :Observable<any> {
    console.log('cost created service',cost)
    return this.http.post(APIConstants.COSTINSERT,cost)
  }
  costBulkData(cost) :Observable<any> {
    console.log('cost created service',cost) 
    return this.http.post(APIConstants.COSTBULK,cost)
  }
  costUpdatedata(cost) :Observable<any> {
    console.log('cost updated service',cost)
    return this.http.post(APIConstants.COSTEDIT,cost)
  }
  deptUpdatedata(dept) :Observable<any> {
    console.log('dept updated service',dept)
    return this.http.post(APIConstants.DEPTEDIT,dept)
  }
 
  deptGetData() :Observable<any> {
    console.log("in service dept get data")
    return this.http.get(APIConstants.DEPTGETDATA)
  }
  deptInsertData(dept) :Observable<any> {
    console.log('cost created service',dept)
    return this.http.post(APIConstants.DEPTINSERT,dept);
  }
  deptUploadData(dept) :Observable<any> {
    console.log('cost created service',dept)
    return this.http.post(APIConstants.DEPTUPLOAD,dept);
  }
 

  relGroupInsertData(data) :Observable<any> {
    // console.log('cost created service',data)
    return  this.http.post(APIConstants.RELGROUPINSERT,data)
  }
 
  relGroupGetData() :Observable<any> {
    return this.http.get(APIConstants.RELGROUPGETDATA)
  }

  createRelCategory(data) :Observable<any> {
    // console.log('cost created service',data)
    return  this.http.post(APIConstants.RELCATEGORYINSERT,data)
  }
 
  relCategoryGetData() :Observable<any> {
    return this.http.get(APIConstants.RELCATEGORYGETDATA)
  }

  createRelType(data) :Observable<any> {
    // console.log('cost created service',data)
    return  this.http.post(APIConstants.RELTYPEINSERT,data)
  }
 
  relTypeGetData() :Observable<any> {
    return this.http.get(APIConstants.RELTYPEGETDATA)
  }

  createRelSubType(data) :Observable<any> {
    // console.log('cost created service',data)
    return  this.http.post(APIConstants.RELSUBTYPEINSERT,data)
  }
 
  relSubTypeGetData() :Observable<any> {
    return this.http.get(APIConstants.RELSUBTYPEGETDATA)
  }
  // CATEGORIES OF RELATIONS
  createCategories(data) :Observable<any> {
    // console.log('cost created service',data)
    return  this.http.post(APIConstants.CATEGORIESINSERT,data)
  }
  updateCategories(data) :Observable<any> {
    // console.log('cost created service',data)
    return  this.http.post(APIConstants.CATEGORIESUPDATE,data)
  }
 
  categoriesGetData() :Observable<any> {
    return this.http.get(APIConstants.CATEGORIESGETDATA)
  }

  // transactions
  createTransactionSubType(data) :Observable<any> {
    // console.log('cost created service',data)
    return  this.http.post(APIConstants.TRANSACTIONSUBTYPEINSERT,data)
  }
 
  transactionSubTypeGetData() :Observable<any> {
    return this.http.get(APIConstants.TRANSACTIONSUBTYPEGETDATA)
  }
  createTransactionType(data) :Observable<any> {
    // console.log('cost created service',data)
    return  this.http.post(APIConstants.TRANSACTIONTYPEINSERT,data)
  }
  uploadTransactionType(data) :Observable<any> {
    // console.log('cost created service',data)
    return  this.http.post(APIConstants.TRANSACTIONBULK,data)
  }
  uploadTransactionSubType(data) :Observable<any> {
    // console.log('cost created service',data)
    return  this.http.post(APIConstants.TRANSACTIONSUBTYPEBULK,data)
  }
 
  transactionTypeGetData() :Observable<any> {
    return this.http.get(APIConstants.TRANSACTIONTYPEGETDATA,)
  }

  // edit for all relations and transactions
  relationGroupUpdatedata(data) :Observable<any> {
    console.log('group updated service',data)
    return this.http.post(APIConstants.RELGROUPEDITDATA,data)
  }
 
  relationCategoryUpdatedata(data) :Observable<any> {
    console.log('category updated service',data)
    return this.http.post(APIConstants.RELCATEGORYEDITDATA,data)
  }
 
  relationTypeUpdatedata(data) :Observable<any> {
    console.log('group updated service',data)
    return this.http.post(APIConstants.RELTYPEEDITDATA,data)
  }
 
  relationSubTypeUpdatedata(data) :Observable<any> {
    console.log('group updated service',data)
    return this.http.post(APIConstants.RELSUBTYPEEDITDATA,data)
  }
 
  transactionTypeUpdatedata(data) :Observable<any> {
    console.log('group updated service',data)
    return this.http.post(APIConstants.TRANSACTIONTYPEEDITDATA,data)
  }
 
 transactionSubTypeUpdatedata(data) :Observable<any> {
    console.log('group updated service',data)
    return this.http.post(APIConstants.TRANSACTIONSUBTYPEEDITDATA,data)
  }
  // upload of realtions
  uploadRelationGroup(data) :Observable<any> {
    return  this.http.post(APIConstants.RELGROUPUPLOAD,data)
  }
  uploadRelationCategory(data) :Observable<any> {
    return  this.http.post(APIConstants.RELCATEGORYUPLOAD,data)
  }
  uploadRelationType(data) :Observable<any> {
    return  this.http.post(APIConstants.RELTYPEUPLOAD,data)
  }
  uploadRelationSubType(data) :Observable<any> {
    return  this.http.post(APIConstants.RELSUBTYPEUPLOAD,data)
  }
  uploadLocation(data) :Observable<any> {
    return  this.http.post(APIConstants.LOCATIONUPLOAD,data)
  }
  uploadCategories(data) :Observable<any> {
    return  this.http.post(APIConstants.LOCATIONUPLOAD,data)
  }
  uploadDepartment(data) :Observable<any> {
    return  this.http.post(APIConstants.DEPTUPLOAD,data)
  }
 relatedPartiesGetData(check) :Observable<any> {
    return this.http.post(APIConstants.RELATEDPARTIESGETDATA,check)
  }
  relatedPartiesInsertData(data) :Observable<any> {
    console.log('sbu created service',data)
    return this.http.post(APIConstants.RELATEDPARTIESINSERT,data)
  }
  relatedPartiesUpdateData(data) :Observable<any> {
    console.log('sbu update service',data)
    return this.http.post(APIConstants.RELATEDPARTIESEDIT,data)
  }
  relatedPartiesUploadData(data) :Observable<any> {
    return this.http.post(APIConstants.RELATEDPARTIESUPLOAD,data)
  }
  transactionNamesGetDta() :Observable<any> {
    return this.http.get(APIConstants.TRANSACTIONNAMEGETDATA)
  }
  transactionNameInsertData(data) :Observable<any> {
    console.log('sbu created service',data)
    return this.http.post(APIConstants.TRANSACTIONNAMEINSERT,data)
  }
  transactionUpdate(data) :Observable<any> {
    console.log('sbu update service',data)
    return this.http.post(APIConstants.TRANSACTIONNAMEEDITDATA,data)
  }
  uploadTransactionNames(data) :Observable<any> {
    return this.http.post(APIConstants.TRANSACTIONNAMEBULK,data)
  }

  createSubUser(data) :Observable<any> {
    return this.http.post(APIConstants.SUBUSERCREATE,data)
  }
  editSubUser(data) :Observable<any> {
    return this.http.post(APIConstants.SUBUSEREDITDATA,data)
  }
  subUsersGetData(uuidUser) :Observable<any> {
    
    return this.http.get(APIConstants.SUBUSERGETDATA+'/'+uuidUser)
  }
  
  // subUsersGetData() :Observable<any> {
  //   return this.http.get(APIConstants.SUBUSERGETDATA)
  // }
  createUserGroup(data) :Observable<any> {
    return this.http.post(APIConstants.USERGROUPINSERT,data)
  }
  updateUserGroup(data) :Observable<any> { 
    return this.http.post(APIConstants.UPDATEUSERGROUP,data)
  }
  assignUserGroup(data) :Observable<any> {
    return this.http.post(APIConstants.GROUPUSERASSIGN,data)
  }
  getUserGroup() :Observable<any> {
    return this.http.get(APIConstants.USERGROUPGET)
  }
  getuserassigngroup(data) :Observable<any> {
    return this.http.get(APIConstants.GETGROUPUSERASSIGN+'/'+data)
  }
  removeuserassigngroup(data) :Observable<any> {
    console.log("service data",data)
    return this.http.post(APIConstants.REMOVEUSERFROMGROUP,data)
  }

  getInternalApproval()  :Observable<any>{
    return this.http.get(APIConstants.GETINTERNALAPPROVAL)
  }
  insertInternalApproval(internalApproval: any) :Observable<any> {
    return this.http.post(APIConstants.INSERTINTERNALAPPROVAL,internalApproval)
  }
  updatetInternalApproval(internalApproval: any) :Observable<any> {
    return this.http.post(APIConstants.UPDATEINTERNALAPPROVAL,internalApproval)
  }

  transactionCategoryGetData() :Observable<any> {
    return this.http.get(APIConstants.TRANSACTIONCATEGORYGETDATA)
  }
  transactionCategoryInsert(form) :Observable<any> {
    return this.http.post(APIConstants.TRANSACTIONCATEGORYINSERT,form)
  }
  updateTransactionCategory(form) :Observable<any> {
    return this.http.post(APIConstants.TRANSACTIONCATEGORYEDITDATA,form)
  }

  //========================================

  salientContractGetData():Observable<any> {  
    return this.http.get(APIConstants.SALIENTCONTRACTGETDATA)
  }
  transactionsInsert(data) :Observable<any> {
    return this.http.post(APIConstants.TRANSACTIONSINSERT,data)
  }
  unitMasterGetData() :Observable<any> {    
    return this.http.get(APIConstants.UNITMASTERGETDATA)
  }
  transactionsListGetData() :Observable<any> {    
    return this.http.get(APIConstants.TRANSACTIONSLISTGETDATA)
  }
  uploadFile(data: FormData) :Observable<any> {  
    return this.http.post(APIConstants.UPLOADFILE, data)
  }
  rulesInsert(data) :Observable<any> {  
    return this.http.post(APIConstants.RULESINSERT, data)
  }
  
  deleteRulesdata(data) :Observable<any> {  
    return this.http.post(APIConstants.DELETERULESTDATA, data)
  }
  rulesDefineWithFact(data) :Observable<any> {  
    return this.http.post(APIConstants.RULESDEFINEWITHFACT, data)
  }
  actionsListGetData():Observable<any> {  
    return this.http.get(APIConstants.ACTIONSLISTGETDATA)
  }  
  uploadDocumentGetData(data):Observable<any> { 
        
    return this.http.post(APIConstants.UPLOADDOCUMENTGETDATA , data)
  }

  // *Rules engine use for *//
  IFruleEngineInsert(data):Observable<any> {  
    return this.http.post(APIConstants.RULEINSERT,data)
  }
  rulesListGetData() :Observable<any> {    
       
    return this.http.get(APIConstants.RULESLISTGETDATA)
  }
  
  //===============
  uomGetData() :Observable<any> {
    return this.http.get(APIConstants.UOMGETDATA)
  }
  uomInsertData(data) :Observable<any> {  
    return  this.http.post(APIConstants.UOMINSERT,data)
  }
  updateUomdata(data) :Observable<any> {  
    return  this.http.post(APIConstants.UPDATEUOMDATA,data)
  }
  
  attributesGetdata() :Observable<any> {
    return this.http.get(APIConstants.ATTRIBUTESGETDATA)
  }
  attributesInsert(data) :Observable<any> {  
    return  this.http.post(APIConstants.ATTRIBUTESINSERT,data)
  }
  updateattributesdata(data) :Observable<any> {  
    return  this.http.post(APIConstants.UPDATEATTRIBUTESDATA,data)
  }
  
  transactionqualifierGetdata(id : string) :Observable<any> {
       
    let params = new HttpParams();
    params = params.append('transaction_id', id);   
    return this.http.get(APIConstants.TRANSACTIONQUALIFIERGETDATA, {params: params})
  }
  transactionqualifierInsert(data) :Observable<any> {  
    return  this.http.post(APIConstants.TRANSACTIONQUALIFIERINSERT,data)
  }
  updatetransactionqualifierdata(data) :Observable<any> {  
    return  this.http.post(APIConstants.UPDATETRANSACTIONQUALIFIERDATA,data)
  }
  transactionmodifiersGetdata(id : string) :Observable<any> {
    let params = new HttpParams();
    params = params.append('transaction_id', id); 
    return this.http.get(APIConstants.TRANSACTIONMODIFIERSGETDATA , {params: params})
  }
  transactionmodifiersInsert(data) :Observable<any> {  
    return  this.http.post(APIConstants.TRANSACTIONMODIFIERSINSERT,data)
  }
  updatetransactionmodifiersdata(data) :Observable<any> {  
    return  this.http.post(APIConstants.UPDATETRANSACTIONMODIFIERSDATA,data)
  }
  pricelistsGetdata() :Observable<any> {
    return this.http.get(APIConstants.PRICELISTSGETDATA)
  }
  pricelistsInsert(data) :Observable<any> {  
    return  this.http.post(APIConstants.PRICELISTSINSERT,data)
  }
  updatepricelistsdata(data) :Observable<any> {  
    return  this.http.post(APIConstants.UPDATEPRICELISTSDATA,data)
  }
  pricelistmodifiersGetdata() :Observable<any> {
    return this.http.get(APIConstants.PRICELISTMODIFIERSGETDATA)
  }
  pricelistmodifiersInsert(data) :Observable<any> {  
    return  this.http.post(APIConstants.PRICELISTMODIFIERSINSERT,data)
  }
  updatepricelistmodifiersdata(data) :Observable<any> {  
    return  this.http.post(APIConstants.UPDATEPRICELISTMODIFIERSDATA,data)
  }
  pricelistqualifiersGetdata(id : string) :Observable<any> {
    let params = new HttpParams();
    params = params.append('pricelist_id', id);
    return this.http.get(APIConstants.PRICELISTQUALIFIERSGETDATA , {params: params})
  }
  pricelistqualifiersInsert(data) :Observable<any> {  
    return  this.http.post(APIConstants.PRICELISTQUALIFIERSINSERT,data)
  }
  updatepricelistqualifiersdata(data) :Observable<any> {  
    return  this.http.post(APIConstants.UPDATEPRICELISTQUALIFIERSDATA,data)
  }
  qualifiersGetdata() :Observable<any> {
    return this.http.get(APIConstants.QUALIFIERSGETDATA)
  }
  modifiersGetdata() :Observable<any> {
    return this.http.get(APIConstants.MODIFIERSGETDATA)
  }
  attributevaluesGetdata(id : string) :Observable<any> {
    let params = new HttpParams();
    params = params.append('attribute_id', id); 
    return this.http.get(APIConstants.ATTRIBUTEVALUESGETDATA , {params: params})
  }
  updateattributevaluesdata(data) :Observable<any> {  
    return  this.http.post(APIConstants.UPDATEATTRIBUTEVALUESDATA,data)
  }
  
  pricelistlinesGetdata() :Observable<any> {
    return this.http.get(APIConstants.PRICELISTLINESGETDATA)
  }
  pricelistlinesInsert(data) :Observable<any> {  
    return  this.http.post(APIConstants.PRICELISTLINESINSERT,data)
  }
  updatepricelistlinesdata(data) :Observable<any> {  
    return  this.http.post(APIConstants.UPDATEPRICELISTLINESDATA,data)
  }

  pricelistlinequalifiersGetdata(id : string) :Observable<any> {
    let params = new HttpParams();
    params = params.append('line_id', id);
    return this.http.get(APIConstants.PRICELISTLINEQUALIFIERSGETDATA , {params: params})
  }
  pricelistlinequalifiersInsert(data) :Observable<any> {  
    return  this.http.post(APIConstants.PRICELISTLINEQUALIFIERSINSERT,data)
  }
  updatepricelistlinequalifiersdata(data) :Observable<any> {  
    return  this.http.post(APIConstants.UPDATEPRICELISTLINEQUALIFIERSDATA,data)
  }

  pricelistlinemodifiersGetdata(id : string) :Observable<any> {
    let params = new HttpParams();
    params = params.append('line_id', id);
    return this.http.get(APIConstants.PRICELISTLINEMODIFIERSGETDATA , {params: params})
  }
  pricelistlinemodifiersInsert(data) :Observable<any> {  
    return  this.http.post(APIConstants.PRICELISTLINEMODIFIERSINSERT,data)
  }
  updatepricelistlinemodifiersdata(data) :Observable<any> {  
    return  this.http.post(APIConstants.UPDATEPRICELISTLINEMODIFIERSDATA,data)
  }

  pricelistlinequalifiersGetdataBy_transaction_id(id : string) :Observable<any> {
    let params = new HttpParams();
    params = params.append('transaction_id', id);
    return this.http.get(APIConstants.PRICELISTLINEQUALIFIERSGETDATABY_TRANSACTIONID , {params: params})
  }
  pricelistlinemodifiersGetdataBy_transaction_id(id : string) :Observable<any> {
    let params = new HttpParams();
    params = params.append('transaction_id', id);
    return this.http.get(APIConstants.PRICELISTLINEMODIFIERSGETDATABY_TRANSACTIONID , {params: params})
  }

  pricelistlinediscountGetdata(id : string) :Observable<any> {
    let params = new HttpParams();
    params = params.append('line_id', id);
    return this.http.get(APIConstants.PRICELISTLINEDISCOUNTGETDATA , {params: params})
  }

  pricelistlinepriceGetdata(id : string) :Observable<any> {
    let params = new HttpParams();
    params = params.append('line_id', id);
    return this.http.get(APIConstants.PRICELISTLINEPRICEGETDATA , {params: params})
  }

  transactionActionsUpdate(data) :Observable<any> {    
    return this.http.post(APIConstants.TRANSACTIONACTIONUPDATE , data)
  }

  transactionsapprove(data) :Observable<any> {    
    return this.http.post(APIConstants.TRANSACTIONSAPPROVE , data)
  }

  transactionsListGetDataapproved() :Observable<any> {    
    return this.http.get(APIConstants.TRANSACTIONSLISTGETDATAAPPROVED)
  }
  transactionsListGetDataunapproved() :Observable<any> {    
    return this.http.get(APIConstants.TRANSACTIONSLISTGETDATAUNAPPROVED)
  }
  countryGetData() :Observable<any> {
    return this.http.get(APIConstants.COUNTRYGETDATA)
  }
  stateGetData() :Observable<any> {
    return this.http.get(APIConstants.STATEGETDATA)
  }
   cityGetData() :Observable<any> {
    return this.http.get(APIConstants.CITYGETDATA)
  }
  transactionsWithdrawn(data) :Observable<any> {    
    return this.http.post(APIConstants.TRANSACTIONSWITHDRAWN , data)
  }
  partyannualTransactions(id ,from_date, to_date) :Observable<any> {
    let params = new HttpParams();
    params = params.append('related_party_id', id);
    params = params.append('from_date', from_date);
    params = params.append('to_date', to_date);
    return this.http.get(APIConstants.PARTYANNUALTRANSACTIONS , {params: params})
  }
  transactionsgeneratedId(name) :Observable<any> {
    let params = new HttpParams();
    params = params.append('name', name);
    return this.http.get(APIConstants.TRANSACTIONSGENERATEDID, {params: params})
  }
  ruleActionsGetData(rule_id) :Observable<any> {
    let params = new HttpParams();
    params = params.append('rule_id', rule_id);
    return this.http.get(APIConstants.RULEACTIONSGETDATA, {params: params})
  }
  transactionUpdatedata(data) :Observable<any> {    
    return this.http.post(APIConstants.TRANSACTIONUPDATEDATA , data)
  }

  transactionlinequalifiersGetData(transaction_line_id) :Observable<any> {
    let params = new HttpParams();
    params = params.append('transaction_line_id', transaction_line_id);
    return this.http.get(APIConstants.TRANSACTIONLINEQUALIFIERSGETDATA, {params: params})
  }
  meetingsGetData() :Observable<any> {
    return this.http.get(APIConstants.MEETINGSGETDATA)
  }
  meetingtransactionsGetData() :Observable<any> {
    return this.http.get(APIConstants.MEETINGTRANSACTIONSGETDATA)
  }
  transactionssendforapprove(data) :Observable<any> {    
    return this.http.post(APIConstants.TRANSACTIONSSENDFORAPPROVER , data)
  }
  confighistoryGetData(fiscal_year) :Observable<any> {
    let params = new HttpParams();
    params = params.append('fiscal_year', fiscal_year);
    return this.http.get(APIConstants.CONFIGHISTORYGETDATA , {params: params})
  }
  confighistoryUpdate(data) :Observable<any>{
    return this.http.post(APIConstants.CONFIGHISTORYUPDATE,data)
  }
  confighistoryInsertData(data):Observable<any>{
    return this.http.post(APIConstants.CONFIGHISTORYINSERTDATA,data)
  }
  transactionsListGetDataByParty(related_party_id) :Observable<any> {
    let params = new HttpParams();
    params = params.append('related_party_id', related_party_id);
    return this.http.get(APIConstants.TRANSACTIONSLISTGETDATABYPARTY , {params: params})
  }
  getAllPartyTransaction_sp(related_party_id) :Observable<any> {
    let params = new HttpParams();
    params = params.append('related_party_id', related_party_id);
    return this.http.get(APIConstants.GETALLPARTYTRANSACTIONSP , {params: params})
  }
  transactionsListGetDataByPartyandname(related_party_id , transaction_name_id) :Observable<any> {
    let params = new HttpParams();
    params = params.append('related_party_id', related_party_id);
    params = params.append('transaction_name_id', transaction_name_id);
    return this.http.get(APIConstants.TRANSACTIONSLISTGETDATABYPARTYANDNAME , {params: params})
  }

  transactionsalientcontractGetData(transaction_id) :Observable<any> {
    let params = new HttpParams();
    params = params.append('transaction_id', transaction_id);
    return this.http.get(APIConstants.TRANSACTIONSALIENTCONTRACTGETDATA , {params: params})
  }
  salientcontractInsert(data):Observable<any>{
    return this.http.post(APIConstants.SALIENTCONTRACTINSERT,data)
  }
  salientcontractUpdate(data):Observable<any>{
    return this.http.post(APIConstants.SALIENTCONTRACTUPDATE,data)
  }
} 
