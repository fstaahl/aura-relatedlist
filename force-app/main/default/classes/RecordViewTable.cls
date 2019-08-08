public with sharing class RecordViewTable {

    @AuraEnabled(cacheable=true)
    public static recordTable getData(String sobj, String fields, String fieldsToLabel, String clause, String soqlOrder, String sortDESC, String referenceFields, String referenceFieldsIndices, String referenceUrlPrefixes, String lookup, String lookupType, String xRefLookupName, String xRefSobj, String recordId, String limitRecords, Boolean currencyFromRecord){
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Map<String, Schema.SObjectField> fieldMap = schemaMap.get(sobj).getDescribe().fields.getMap();
        recordTable returnTable = new recordTable();
        List<tableRow> returnList = new List<tableRow>();
        Map<Integer,tableHeader> fieldLabels = new Map<Integer,tableHeader>();
        returnTable.rows = returnList;
        returnTable.headers = fieldLabels.values();

        if(schemaMap.get(sobj).getDescribe().isQueryable() && schemaMap.get(sobj).getDescribe().isAccessible()){    
            String[] fieldsList = fields.split(',');
            String[] referenceFieldsList;
            if(!String.isBlank(referenceFields)){
                referenceFieldsList = referenceFields.split(',');
            }
            String[] referenceFieldsIndicesList;
            if(!String.isBlank(referenceFieldsIndices)){
                referenceFieldsIndicesList = referenceFieldsIndices.split(',');
            }
            String[] prefixList;
            if(!String.isBlank(referenceUrlPrefixes)){
                prefixList = referenceUrlPrefixes.split(',');
            } else{
                prefixList = new String[]{};
            }
            Map<Integer,String> referenceFieldsMap = new Map<Integer,String>();
            Map<Integer,String> prefixMap = new Map<Integer,String>();
            if(!String.isBlank(referenceFields) && !String.isBlank(referenceFieldsIndices)){
                for(Integer i = 0; i < referenceFieldsList.size(); i++){
                    referenceFieldsMap.put(Integer.valueOf(referenceFieldsIndicesList[i]),referenceFieldsList[i]);
                    if(prefixList.size() > 0){
                        prefixMap.put(Integer.valueOf(referenceFieldsIndicesList[i]),prefixList[i]);
                    }
                }
            }
            for(Integer i = 0; i < fieldsList.size(); i++){
                fieldLabels.put(i,getLabel(sobj,fieldsList[i]));
            }
            returnTable.headers = fieldLabels.values();

            String lookupId = '';
            if(lookupType == 'parallel' && !String.isBlank(lookup)){
                String lookupSOQL = 'SELECT '+lookup+' FROM '+sobj+' WHERE Id = \''+recordId+'\' LIMIT 1';
                sObject record = Database.query(lookupSOQL)[0];
                lookupId = (String)record.get(lookup);
            } else if(lookupType == 'cross-reference' && !String.isBlank(xRefLookupName) && !String.isBlank(xRefSobj)){
                String lookupSOQL = 'SELECT '+xRefLookupName+' FROM '+xRefSobj+' WHERE Id = \''+recordId+'\' LIMIT 1';
                sObject record = Database.query(lookupSOQL)[0];
                lookupId = (String)record.get(xRefLookupName);
            }

            String soql = 'SELECT Id, ';
            if(!String.isBlank(fieldsToLabel)){
                for(String s : fieldsToLabel.split(',')){
                    if(fields.contains(s)){
                        fields = fields.replace(s,'tolabel('+s+')');
                    }
                }
            }
            soql += fields;
            if(!String.isBlank(referenceFields)){
                soql += ','+referenceFields;
            }
            if(currencyFromRecord){
                soql += ', CurrencyIsoCode';
            }
            soql += ' FROM '+sobj+'';
            if(!String.isBlank(clause)){
                soql += ' WHERE '+clause;
                if(!String.isBlank(lookup) && !String.isBlank(recordId)){
                    if(lookupType != 'straight'){
                        soql += ' AND '+lookup+' = \''+lookupId+'\'';
                    } else{
                        soql += ' AND '+lookup+' = \''+recordId+'\'';
                    }
                }
            } else if(!String.isBlank(lookup) && !String.isBlank(recordId)){
                if(lookupType != 'straight'){
                    soql += ' WHERE '+lookup+' = \''+lookupId+'\'';
                } else{
                    soql += ' WHERE '+lookup+' = \''+recordId+'\'';
                }
            }

            if(!String.isBlank(soqlOrder)){
                soql += ' ORDER BY '+soqlOrder+' '+sortDESC;
            }
            if(!String.isBlank(limitRecords)){
                soql += ' LIMIT '+limitRecords;
            }
            System.debug('query = ' + soql);
            List<sObject> data = Database.query(soql);

            for(sObject so : data){
                Integer i = 0;
                tableRow row = new tableRow();
                row.recordId = so.Id;
                row.sObjectName = sobj;

                List<tableCell> cells = new List<tableCell>();
                for(String s : fieldsList){
                    tableCell cell = new tableCell();
                    cell.apiName = s;
                    cell.label = fieldLabels.get(i);
                    cell.recordId = so.Id;
                    cell.sObjectName = sobj;
                    if(s.contains('.')){
                        String[] helper = s.split('\\.');
                        try{
                            if(helper[0].contains('__r')){
                                String newS = helper[0].replace('__r','__c');
                                cell.fieldType = ''+schemaMap.get(newS).getDescribe().fields.getMap().get(helper[1]).getDescribe().getType();
                            } else{
                                cell.fieldType = ''+schemaMap.get(helper[0]).getDescribe().fields.getMap().get(helper[1]).getDescribe().getType();
                            }
                        }catch (Exception e){
                            cell.fieldType = 'No type';
                        }
                        try{
                            cell.value = ''+so.getSObject(helper[0]).get(helper[1]);
                        }catch(Exception e){
                            cell.value = 'No value';
                        }
                    }else{
                        cell.fieldType = ''+fieldMap.get(s).getDescribe().getType();
                        cell.value = ''+so.get(s);
                    }
                    if(cell.fieldType == 'REFERENCE'){
                        if(!String.isBlank(referenceFields) && !String.isBlank(referenceFieldsIndices)){
                            if(referenceFieldsMap.containsKey(i)){
                                String[] helper = referenceFieldsMap.get(i).split('\\.');
                                try{
                                    cell.referenceField = ''+so.getSObject(helper[0]).get(helper[1]);
                                } catch (Exception e){
                                    cell.referenceField = '';
                                }
                                if(prefixMap.containsKey(i)){
                                    cell.referenceUrlPrefix = prefixMap.get(i);
                                } else{
                                    cell.referenceUrlPrefix = '';
                                }
                                
                            }
                        } else{
                            cell.referenceField = '';
                            cell.referenceUrlPrefix = '';
                        }
                    } else{
                        cell.referenceField = '';
                        cell.referenceUrlPrefix = '';
                    }
                    cells.add(cell);
                    i++;
                }
                row.cells = cells;
                if(currencyFromRecord){
                    row.currencyIsoCode = ''+so.get('CurrencyIsoCode');
                } else{
                    row.currencyIsoCode = '';
                }
                returnList.add(row);
            }

            if(returnList.size()>0){
                returnTable.rows = returnList;
            }
            
        }
        
        return returnTable;

    }

    @AuraEnabled(cacheable=true)
    public static tableHeader getLabel(String sobj, String field){
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        tableHeader th = new tableHeader();
        th.apiName = field;

        if(field.contains('.')){
            String[] helper = field.split('\\.');
            if(helper[0].contains('__r')){
                String newS = helper[0].replace('__r','__c');
                Schema.SObjectType sobjSchema = schemaMap.get(sobj);
                Map<String, Schema.SObjectField> fieldMap = sobjSchema.getDescribe().fields.getMap();
                try{
                    th.label = ''+fieldMap.get(newS).getDescribe().getLabel();
                    th.type = ''+fieldMap.get(field).getDescribe().getType();
                }catch(Exception e){
                    th.type = 'Custom';
                }

                return th;
            } else {
                //return field name of last .reference
                String[] references = field.split('.');
                return references.get(references.size());
            }
            Schema.SObjectType sobjSchema = schemaMap.get(helper[0]);
            Map<String, Schema.SObjectField> fieldMap = sobjSchema.getDescribe().fields.getMap();
            th.label = ''+fieldMap.get(helper[1]).getDescribe().getLabel();
            th.type = ''+fieldMap.get(helper[1]).getDescribe().getType();
            return th;
        }
        Schema.SObjectType sobjSchema = schemaMap.get(sobj);
        Map<String, Schema.SObjectField> fieldMap = sobjSchema.getDescribe().fields.getMap();
        th.label = ''+fieldMap.get(field).getDescribe().getLabel();
        th.type = ''+fieldMap.get(field).getDescribe().getType();
        return th;
    }

    public class tableCell{
        @AuraEnabled String apiName {get;set;}
        @AuraEnabled tableHeader label {get;set;}
        @AuraEnabled String value {get;set;}
        @AuraEnabled String fieldType {get;set;}
        @AuraEnabled String recordId {get;set;}
        @AuraEnabled String sObjectName {get;set;}
        @AuraEnabled String referenceField {get;set;}
        @AuraEnabled String referenceUrlPrefix {get;set;}
    }

    public class tableRow{
        @AuraEnabled List<tableCell> cells {get;set;}
        @AuraEnabled String recordId {get;set;}
        @AuraEnabled String sObjectName {get;set;}
        @AuraEnabled String currencyIsoCode {get;set;}
    }

    public class tableHeader{
        @AuraEnabled String label {get;set;}
        @AuraEnabled String type {get;set;}
        @AuraEnabled String apiName {get;set;}
    }

    public class recordTable{
        @AuraEnabled List<tableHeader> headers{get;set;}
        @AuraEnabled List<tableRow> rows{get;set;}
    }

}