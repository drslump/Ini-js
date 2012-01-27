var assert = require('assert'),
    Ini = require('./../lib/Ini.js').Ini;

describe('Ini', function(){

    var ini;

    beforeEach(function () {
        ini = new Ini();
    });

    it('parse prop', function(){
        ini.parse('prop = value');
        expect(ini.get('prop')).toEqual('value');
    });

    it('parse bool', function(){
        ini.parse('propT=true\n propF=false\n propOn=on\n propOff=off');
        expect(ini.get('propT')).toEqual(true);
        expect(ini.get('propF')).toEqual(false);
        expect(ini.get('propOn')).toEqual(true);
        expect(ini.get('propOff')).toEqual(false);
    });

    it('parse int', function(){
        ini.parse('prop=10');
        expect(ini.get('prop')).toEqual(10);
    });

    it('parse quoted', function(){
        ini.parse('prop1="value"\nprop2="val\"ue"\nprop3="val#ue"\nprop4=" value "');
        expect(ini.get('prop1')).toEqual('value');
        expect(ini.get('prop2')).toEqual('val"ue');
        expect(ini.get('prop3')).toEqual('val#ue');
        expect(ini.get('prop4')).toEqual(' value ');
    });

    it('parse continued line', function(){
        ini.parse('prop=value1\\\n  value2');
        expect(ini.get('prop')).toEqual('value1 value2');
    });

    it('parse continued quoted', function(){
        ini.parse('prop="value1\\\n  value2"');
        expect(ini.get('prop')).toEqual('value1 value2');
    });

    it('parse comments', function(){
        ini.parse('# comment\nfoo = Foo ;comment\n;bar=Bar');
        expect(ini.get('foo')).toEqual('Foo');
        expect(ini.get('bar')).toEqual(null);
    });

    it('parse section', function(){
        ini.parse('[foo]\nprop=value');
        expect(ini.get('foo.prop')).toEqual('value');
    });

    it('parse section label', function(){
        ini.parse('[foo "bar"]\nprop = value');
        expect(ini.get('foo:bar').label).toEqual('bar');
        expect(ini.get('foo:bar.prop')).toEqual('value');
    });

    it('export to object', function(){
        ini.parse('[foo]\nbar = value\nbaz = value');
        expect(ini.toObject()).toEqual({'foo':{bar:'value',baz:'value'}});
        expect(ini.get('foo').toObject()).toEqual({bar:'value',baz:'value'});
    });

    it('export to string', function(){
        ini.parse('[foo]\nbar=value\nbaz=value');
        expect(ini.toString()).toEqual('[foo]\nbar = value\nbaz = value\n\n');
        expect(ini.get('foo').toString()).toEqual('bar = value\nbaz = value\n');
    });
});

