const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("aliasMap", () => {
  let aliasMap;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    aliasMap = injector.get('aliasMap');
  });

  describe("addDoc", () => {
    it("should add the doc to an array for each alias", () => {
      const doc = { aliases: ['a', 'b', 'c'] };
      aliasMap.addDoc(doc);
      expect(aliasMap.getDocs('a')).toEqual([doc]);
      expect(aliasMap.getDocs('b')).toEqual([doc]);
      expect(aliasMap.getDocs('c')).toEqual([doc]);
    });

    it("should not add the doc if it has no aliases", () => {
      const doc = { };
      aliasMap.addDoc(doc);
      expect(aliasMap.getDocs('a')).toEqual([]);
      expect(aliasMap.getDocs('b')).toEqual([]);
      expect(aliasMap.getDocs('c')).toEqual([]);
    });
  });

  describe("getDocs", () => {
    it("should return an empty array if no doc matches the alias", () => {
      const doc = { aliases: ['a', 'b', 'c'] };
      expect(aliasMap.getDocs('d')).toEqual([]);
    });
  });

  describe("removeDoc", () => {
    it("should remove the doc from any parts of the aliasMap", () => {
      const doc1 = { aliases: ['a','b1'] };
      const doc2 = { aliases: ['a','b2'] };
      aliasMap.addDoc(doc1);
      aliasMap.addDoc(doc2);

      expect(aliasMap.getDocs('a')).toEqual([doc1, doc2]);
      expect(aliasMap.getDocs('b1')).toEqual([doc1]);
      expect(aliasMap.getDocs('b2')).toEqual([doc2]);

      aliasMap.removeDoc(doc1);

      expect(aliasMap.getDocs('a')).toEqual([doc2]);
      expect(aliasMap.getDocs('b1')).toEqual([]);
      expect(aliasMap.getDocs('b2')).toEqual([doc2]);

    });
  });
});