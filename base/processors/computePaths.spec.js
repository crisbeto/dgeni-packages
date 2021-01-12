const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

describe("computePathsProcessor", () => {
  let processor, mockLog;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    processor = injector.get('computePathsProcessor');
    mockLog = injector.get('log');
  });


  it("should do nothing but log a debug message if there is no path template for the given docType", () => {
    processor.pathTemplates = [
      {
        docTypes: ['a'],
        getPath: jasmine.createSpy('getPath').and.returnValue('index'),
        getOutputPath: jasmine.createSpy('getOutputPath').and.returnValue('index.html'),
        pathTemplate: '${ docType }',
        outputPathTemplate: '${ docType }.html'
      }
    ];

    const doc = { docType: 'b' };
    processor.$process([doc]);
    expect(processor.pathTemplates[0].getPath).not.toHaveBeenCalled();
    expect(processor.pathTemplates[0].getOutputPath).not.toHaveBeenCalled();
    expect(doc).toEqual({ docType: 'b' });
    expect(mockLog.debug).toHaveBeenCalled();
  });


  it("should compute path and outputPath using the getPath and getOutputPath functions", () => {
    processor.pathTemplates = [
      {
        docTypes: ['a'],
        getPath: jasmine.createSpy('getPath').and.returnValue('index'),
        getOutputPath: jasmine.createSpy('getOutputPath').and.returnValue('index.html'),
        pathTemplate: '${ docType }',
        outputPathTemplate: '${ docType }.html'
      }
    ];
    const doc = { docType: 'a' };
    processor.$process([doc]);
    expect(processor.pathTemplates[0].getPath).toHaveBeenCalled();
    expect(processor.pathTemplates[0].getOutputPath).toHaveBeenCalled();
    expect(doc).toEqual({ docType: 'a', path: 'index', outputPath: 'index.html' });
  });


  it("should compute the path using the template strings if no getPath/getOutputPath functions are specified", () => {
    processor.pathTemplates = [
      {
        docTypes: ['a'],
        pathTemplate: '${ docType }',
        outputPathTemplate: '${ docType }.html'
      }
    ];
    const doc = { docType: 'a' };
    processor.$process([doc]);
    expect(doc).toEqual({ docType: 'a', path: 'a', outputPath: 'a.html' });
  });


  it("should use the template that matches the given docType", () => {
    processor.pathTemplates = [
      {
        docTypes: ['a'],
        pathTemplate: 'A',
        outputPathTemplate: 'A.html'
      },
      {
        docTypes: ['b'],
        pathTemplate: 'B',
        outputPathTemplate: 'B.html'
      }
    ];

    const docA = { docType: 'a' };
    const docB = { docType: 'b' };

    processor.$process([docA, docB]);

    expect(docA).toEqual({ docType: 'a', path: 'A', outputPath: 'A.html' });
    expect(docB).toEqual({ docType: 'b', path: 'B', outputPath: 'B.html' });
  });


  it("should use the path if present (and not compute a new one)", () => {
    processor.pathTemplates = [
      {
        docTypes: ['a'],
        getPath: jasmine.createSpy('getPath').and.returnValue('index'),
        getOutputPath: jasmine.createSpy('getOutputPath').and.returnValue('index.html'),
        pathTemplate: '${ docType }',
        outputPathTemplate: '${ docType }.html'
      }
    ];
    const doc = { docType: 'a', path: 'already/here', outputPath: 'already/here/file.html' };
    processor.$process([doc]);
    expect(processor.pathTemplates[0].getPath).not.toHaveBeenCalled();
    expect(processor.pathTemplates[0].getOutputPath).not.toHaveBeenCalled();
    expect(doc).toEqual({ docType: 'a', path: 'already/here', outputPath: 'already/here/file.html' });
  });
});