export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    status: 'online',
    app: 'HoloHydro 3D Molecular API',
    endpoints: ['/api/generate-molecule', '/api/generate-questions', '/api/health']
  });
}
