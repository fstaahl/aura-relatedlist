/**
 * Created by takei on 19.6.2018.
 */

@IsTest
private class RecordViewTableTest {
    static testMethod void testRecordViewTable() {
        Account acc = new Account(
            Name = 'TestAccount'
        );
        insert acc;

        Contact con = new Contact(
            FirstName = 'Test1111',
            LastName = 'Test22222',
            Email = 'testaddress@test.test',
            AccountId = acc.Id
        );
        insert con;

        String sobj = 'Contact';
        String fields = 'Name,Account.Name';
        String clause = 'FirstName = \'Test1111\'';
        String limitRecords = '1';
        String recordId = acc.Id;
        String lookup = 'AccountId';
        String fieldForLabel = 'Name';
        String refFields = '';
        String refIndices = '';

        Test.startTest();
        RecordViewTable.recordTable data = RecordViewTable.getData(sobj, fields,'', clause, 'Name', 'DESC',refFields, refIndices, '', lookup,'straight', '','', recordId, limitRecords,false);
        RecordViewTable.tableHeader returnLabel = RecordViewTable.getLabel(sobj, fieldForLabel);
        clause = '';
        data = RecordViewTable.getData(sobj, fields,'', clause,'Name', 'DESC', refFields, refIndices, '', lookup,'straight','','', recordId, limitRecords, false);
        fieldForLabel = 'Account.Name';
        RecordViewTable.tableHeader labl = RecordViewTable.getLabel(sobj, fieldForLabel);

        fields = 'Name,AccountId';
        refFields = 'Account.Name';
        refIndices = '1';
        data = RecordViewTable.getData(sobj, fields,'', clause,'Name', 'DESC', refFields, refIndices, '/test/', lookup,'straight','','', recordId, limitRecords, false);

        Test.stopTest();
    }
}